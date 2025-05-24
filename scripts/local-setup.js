#!/usr/bin/env node

/**
 * Local setup script for Enterprise App
 * This script helps set up the application for local development
 * without any external dependencies.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

// Print a styled message
function printMessage(message, color = colors.white) {
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
    printMessage(`Executing: ${command}`, colors.dim);
    const output = execSync(command, { 
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options
    });
    return { success: true, output: output ? output.toString() : '' };
  } catch (error) {
    if (!options.continueOnError) {
      printMessage(`Error executing command: ${command}`, colors.red);
      printMessage(error.message, colors.red);
    }
    return { success: false, error };
  }
}

// Ask a question and get user input
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(`${colors.yellow}${question}${colors.reset}`, (answer) => {
      resolve(answer);
    });
  });
}

// Check if PostgreSQL is installed
async function checkPostgresql() {
  printHeader('Checking PostgreSQL Installation');
  
  const pgResult = executeCommand('psql --version', { silent: true, continueOnError: true });
  
  if (pgResult.success) {
    printMessage('PostgreSQL is installed!', colors.green);
    return true;
  } else {
    printMessage('PostgreSQL is not installed or not in PATH.', colors.yellow);
    printMessage('You can continue with in-memory storage instead of PostgreSQL.', colors.yellow);
    
    const useInMemory = await askQuestion('Would you like to configure the app to use in-memory storage? (y/n): ');
    
    if (useInMemory.toLowerCase() === 'y') {
      return false;
    } else {
      printMessage('Please install PostgreSQL and run this script again.', colors.red);
      printMessage('Visit https://www.postgresql.org/download/ for installation instructions.', colors.cyan);
      process.exit(1);
    }
  }
}

// Setup environment file
async function setupEnvironment(usePostgres) {
  printHeader('Setting Up Environment Configuration');
  
  // Check if .env already exists
  if (fs.existsSync('.env')) {
    const overwrite = await askQuestion('.env file already exists. Overwrite? (y/n): ');
    if (overwrite.toLowerCase() !== 'y') {
      printMessage('Keeping existing .env file.', colors.yellow);
      return;
    }
  }
  
  // Create .env file
  let dbUrl = 'memory://local';
  
  if (usePostgres) {
    const dbName = await askQuestion('Enter database name (default: enterprise_app): ') || 'enterprise_app';
    const dbUser = await askQuestion('Enter database user (default: postgres): ') || 'postgres';
    const dbPassword = await askQuestion('Enter database password: ');
    const dbHost = await askQuestion('Enter database host (default: localhost): ') || 'localhost';
    const dbPort = await askQuestion('Enter database port (default: 5432): ') || '5432';
    
    dbUrl = `postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;
  }
  
  const sessionSecret = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  
  const envContent = `# Database connection string
DATABASE_URL="${dbUrl}"

# Session secret for authentication
SESSION_SECRET="${sessionSecret}"

# Server port (default: 5000)
PORT=5000

# Application environment
NODE_ENV=development`;
  
  fs.writeFileSync('.env', envContent);
  printMessage('.env file created successfully!', colors.green);
}

// Setup database (for PostgreSQL)
async function setupDatabase(usePostgres) {
  if (!usePostgres) {
    // Make the necessary changes to use in-memory storage
    setupInMemoryStorage();
    return;
  }
  
  printHeader('Setting Up Database');
  
  try {
    // Test database connection
    require('dotenv').config();
    
    printMessage('Testing database connection...', colors.cyan);
    
    const { Pool } = require('pg');
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL
    });
    
    await pool.query('SELECT NOW()');
    printMessage('Database connection successful!', colors.green);
    
    // Ask if user wants to initialize the database
    const initDb = await askQuestion('Initialize database schema? (y/n): ');
    
    if (initDb.toLowerCase() === 'y') {
      printMessage('Initializing database schema...', colors.cyan);
      executeCommand('npm run db:push');
      printMessage('Database schema initialized!', colors.green);
    }
    
    await pool.end();
  } catch (error) {
    printMessage('Database connection failed.', colors.red);
    printMessage(error.message, colors.red);
    
    const useInMemory = await askQuestion('Would you like to use in-memory storage instead? (y/n): ');
    
    if (useInMemory.toLowerCase() === 'y') {
      setupInMemoryStorage();
    } else {
      printMessage('Please check your database configuration and try again.', colors.red);
      process.exit(1);
    }
  }
}

// Configure application to use in-memory storage
function setupInMemoryStorage() {
  printHeader('Configuring In-Memory Storage');
  
  // Modify server/storage.ts to use MemStorage
  const storagePath = path.join(__dirname, '..', 'server', 'storage.ts');
  if (fs.existsSync(storagePath)) {
    try {
      let storageContent = fs.readFileSync(storagePath, 'utf8');
      
      // Check if it's already using MemStorage
      if (storageContent.includes('export const storage = new MemStorage()')) {
        printMessage('Application is already configured to use in-memory storage.', colors.green);
        return;
      }
      
      // Replace DatabaseStorage with MemStorage
      storageContent = storageContent.replace(
        'export const storage = new DatabaseStorage()',
        'export const storage = new MemStorage()'
      );
      
      // Add MemStorage implementation if not present
      if (!storageContent.includes('export class MemStorage')) {
        const memStorageImpl = `
// In-memory storage implementation
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
}`;
        
        // Find a good spot to insert the MemStorage implementation
        const insertPoint = storageContent.indexOf('export class DatabaseStorage');
        if (insertPoint !== -1) {
          storageContent = storageContent.slice(0, insertPoint) + memStorageImpl + '\n\n' + storageContent.slice(insertPoint);
        } else {
          // If we can't find a good spot, just add it before the storage export
          const exportPoint = storageContent.indexOf('export const storage');
          if (exportPoint !== -1) {
            storageContent = storageContent.slice(0, exportPoint) + memStorageImpl + '\n\n' + storageContent.slice(exportPoint);
          }
        }
      }
      
      fs.writeFileSync(storagePath, storageContent);
      printMessage('Successfully configured application to use in-memory storage.', colors.green);
    } catch (error) {
      printMessage('Failed to modify storage.ts file.', colors.red);
      printMessage(error.message, colors.red);
      printMessage('You may need to manually configure the application to use in-memory storage.', colors.yellow);
      printMessage('See the LOCAL_SETUP.md file for instructions.', colors.yellow);
    }
  } else {
    printMessage('Could not find server/storage.ts file.', colors.red);
    printMessage('You may need to manually configure the application to use in-memory storage.', colors.yellow);
    printMessage('See the LOCAL_SETUP.md file for instructions.', colors.yellow);
  }
}

// Install dependencies
async function installDependencies() {
  printHeader('Installing Dependencies');
  
  printMessage('Installing npm dependencies...', colors.cyan);
  executeCommand('npm install');
  printMessage('Dependencies installed successfully!', colors.green);
}

// Main function
async function main() {
  printHeader('Enterprise App Local Setup');
  printMessage('This script will help you set up the application for local development.', colors.cyan);
  
  try {
    // Install dependencies
    await installDependencies();
    
    // Check PostgreSQL
    const usePostgres = await checkPostgresql();
    
    // Setup environment
    await setupEnvironment(usePostgres);
    
    // Setup database
    await setupDatabase(usePostgres);
    
    printHeader('Setup Complete!');
    printMessage('You can now start the application with:', colors.green);
    printMessage('npm run dev', colors.bright);
    
    printMessage('\nFor more information, see the LOCAL_SETUP.md file.', colors.cyan);
  } catch (error) {
    printMessage('An error occurred during setup:', colors.red);
    printMessage(error.message, colors.red);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Run the main function
main();