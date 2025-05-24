#!/usr/bin/env node

/**
 * Script to make the application portable for running offline
 * This prepares the application for use on any machine without Replit dependencies
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

// Print a styled message
function printMessage(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

// Print a section header
function printHeader(text) {
  console.log('\n' + colors.bright + colors.cyan + '='.repeat(50) + colors.reset);
  console.log(colors.bright + colors.cyan + text + colors.reset);
  console.log(colors.bright + colors.cyan + '='.repeat(50) + colors.reset);
}

// Execute a command with error handling
function executeCommand(command, options = {}) {
  try {
    console.log(`Executing: ${command}`);
    execSync(command, { stdio: 'inherit', ...options });
    return true;
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    console.error(error.message);
    return false;
  }
}

// Create a fallback .env file if it doesn't exist
function createEnvFile() {
  printHeader('Creating Environment File');
  
  if (fs.existsSync('.env')) {
    printMessage('Using existing .env file', colors.yellow);
    return;
  }
  
  const envContent = `# Database connection string - update with your local PostgreSQL credentials
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/enterprise_app"

# Session secret for authentication
SESSION_SECRET="local-development-secret-change-in-production"

# Server port (default: 5000)
PORT=5000

# Application environment
NODE_ENV=development`;
  
  fs.writeFileSync('.env', envContent);
  printMessage('.env file created successfully!', colors.green);
}

// Update storage implementation to support in-memory mode
function updateStorageImplementation() {
  printHeader('Updating Storage Implementation');
  
  const storagePath = path.join(__dirname, '..', 'server', 'storage.ts');
  
  if (!fs.existsSync(storagePath)) {
    printMessage('Could not find storage.ts file!', colors.red);
    return false;
  }
  
  let storageContent = fs.readFileSync(storagePath, 'utf8');
  
  // Check if MemStorage is already defined
  if (storageContent.includes('export class MemStorage')) {
    printMessage('MemStorage implementation already exists', colors.green);
    return true;
  }
  
  // Add MemStorage implementation
  const memStorageImpl = `
// In-memory storage implementation for offline use
export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async upsertUser(userData: UpsertUser): Promise<User> {
    const now = new Date();
    const user: User = {
      ...userData,
      createdAt: userData.createdAt || now,
      updatedAt: now
    };
    this.users.set(userData.id, user);
    return user;
  }
}

// Uncomment this line to use in-memory storage instead of database
// export const storage = new MemStorage();
`;
  
  // Find the right spot to insert the MemStorage implementation
  const dbStorageClass = storageContent.indexOf('export class DatabaseStorage');
  const storageExport = storageContent.indexOf('export const storage');
  
  if (dbStorageClass !== -1) {
    // Insert before DatabaseStorage class
    storageContent = storageContent.slice(0, dbStorageClass) + memStorageImpl + storageContent.slice(dbStorageClass);
  } else if (storageExport !== -1) {
    // Insert before storage export
    storageContent = storageContent.slice(0, storageExport) + memStorageImpl + storageContent.slice(storageExport);
  } else {
    // Append to the end
    storageContent += memStorageImpl;
  }
  
  fs.writeFileSync(storagePath, storageContent);
  printMessage('Added MemStorage implementation to storage.ts', colors.green);
  return true;
}

// Create README.offline.md with instructions for offline use
function createOfflineReadme() {
  printHeader('Creating Offline README');
  
  const readmeContent = `# Running Enterprise App Offline

This document provides instructions for running the Enterprise App offline on your local machine without any external dependencies.

## Prerequisites

- Node.js (v18.x or later)
- npm (v8.x or later)
- PostgreSQL (optional - can run with in-memory storage)

## Setup Instructions

1. **Install Dependencies**

   \`\`\`bash
   npm install
   \`\`\`

2. **Configure Environment**

   Copy the example environment file:
   
   \`\`\`bash
   cp .env.example .env
   \`\`\`
   
   Edit the \`.env\` file to match your local environment. If you don't have PostgreSQL installed, see the "Running Without PostgreSQL" section below.

3. **Start the Application**

   \`\`\`bash
   npm run dev
   \`\`\`
   
   The application will be available at http://localhost:5000

## Running Without PostgreSQL

If you don't have PostgreSQL installed, you can run the application with in-memory storage:

1. Edit \`server/storage.ts\`
2. Comment out the line: \`export const storage = new DatabaseStorage();\`
3. Uncomment the line: \`// export const storage = new MemStorage();\`
4. Save the file and restart the application

## Building for Production

To build the application for production:

\`\`\`bash
npm run build
npm start
\`\`\`

## Troubleshooting

- **Port Conflicts**: If port 5000 is already in use, change the PORT in your .env file
- **Database Connection Issues**: Check your PostgreSQL credentials in the .env file
- **Module Not Found Errors**: Run \`npm install\` to ensure all dependencies are installed

## Additional Resources

For more detailed setup instructions, see the LOCAL_SETUP.md file.
`;
  
  fs.writeFileSync('README.offline.md', readmeContent);
  printMessage('Created README.offline.md with offline usage instructions', colors.green);
}

// Update package.json scripts
function updatePackageScripts() {
  printHeader('Updating Package Scripts');
  
  const pkgPath = path.join(__dirname, '..', 'package.json');
  
  if (!fs.existsSync(pkgPath)) {
    printMessage('Could not find package.json!', colors.red);
    return false;
  }
  
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  
  // Add setup script
  pkg.scripts = pkg.scripts || {};
  pkg.scripts['setup'] = 'node scripts/local-setup.js';
  pkg.scripts['portable'] = 'node scripts/make-portable.js';
  
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
  printMessage('Updated package.json scripts', colors.green);
  return true;
}

// Main function
function main() {
  printHeader('Making Enterprise App Portable');
  
  // Create environment file
  createEnvFile();
  
  // Update storage implementation
  updateStorageImplementation();
  
  // Create offline README
  createOfflineReadme();
  
  // Update package.json scripts
  updatePackageScripts();
  
  printHeader('Portable Setup Complete');
  printMessage('The application is now ready to run offline!', colors.green);
  printMessage('To run it locally, follow the instructions in README.offline.md', colors.cyan);
}

// Run the main function
main();