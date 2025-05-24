#!/usr/bin/env node

/**
 * Script to build the application for local use
 * This creates a production-ready build that can run offline
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

// Clean previous builds
function cleanBuild() {
  printHeader('Cleaning Previous Builds');
  
  // Clean dist directory
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
    printMessage('Removed dist directory', colors.green);
  }
}

// Build the application
function buildApp() {
  printHeader('Building Application');
  
  // Build the client
  printMessage('Building client...', colors.cyan);
  if (!executeCommand('npm run build:client')) {
    printMessage('Failed to build client', colors.red);
    return false;
  }
  
  // Build the server
  printMessage('Building server...', colors.cyan);
  if (!executeCommand('npm run build:server')) {
    printMessage('Failed to build server', colors.red);
    return false;
  }
  
  printMessage('Build completed successfully!', colors.green);
  return true;
}

// Copy necessary files for deployment
function copyDeploymentFiles() {
  printHeader('Preparing Deployment Files');
  
  // Ensure dist directory exists
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
  }
  
  // Copy package.json (only the necessary parts)
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const deployPkg = {
    name: pkg.name,
    version: pkg.version,
    description: pkg.description,
    scripts: {
      start: 'node server/index.js',
      setup: 'node scripts/local-setup.js'
    },
    dependencies: pkg.dependencies
  };
  
  fs.writeFileSync('dist/package.json', JSON.stringify(deployPkg, null, 2));
  printMessage('Created optimized package.json', colors.green);
  
  // Copy README and setup files
  if (fs.existsSync('README.offline.md')) {
    fs.copyFileSync('README.offline.md', 'dist/README.md');
    printMessage('Copied README.md', colors.green);
  }
  
  if (fs.existsSync('LOCAL_SETUP.md')) {
    fs.copyFileSync('LOCAL_SETUP.md', 'dist/LOCAL_SETUP.md');
    printMessage('Copied LOCAL_SETUP.md', colors.green);
  }
  
  // Copy .env.example
  if (fs.existsSync('.env.example')) {
    fs.copyFileSync('.env.example', 'dist/.env.example');
    printMessage('Copied .env.example', colors.green);
  }
  
  // Create scripts directory
  if (!fs.existsSync('dist/scripts')) {
    fs.mkdirSync('dist/scripts');
  }
  
  // Copy setup scripts
  if (fs.existsSync('scripts/local-setup.js')) {
    fs.copyFileSync('scripts/local-setup.js', 'dist/scripts/local-setup.js');
    printMessage('Copied local-setup.js', colors.green);
  }
  
  if (fs.existsSync('scripts/make-portable.js')) {
    fs.copyFileSync('scripts/make-portable.js', 'dist/scripts/make-portable.js');
    printMessage('Copied make-portable.js', colors.green);
  }
  
  printMessage('All deployment files prepared', colors.green);
  return true;
}

// Create a startup script
function createStartupScript() {
  printHeader('Creating Startup Script');
  
  const startScript = `#!/usr/bin/env node

/**
 * Enterprise App Startup Script
 * Run this script to start the application
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Check for .env file
if (!fs.existsSync('.env')) {
  console.log('No .env file found. Creating from example...');
  
  if (fs.existsSync('.env.example')) {
    fs.copyFileSync('.env.example', '.env');
    console.log('.env file created. You may need to edit it with your database credentials.');
  } else {
    console.log('Warning: No .env.example file found. You will need to create an .env file manually.');
  }
}

// Start the application
console.log('Starting Enterprise App...');
console.log('Press Ctrl+C to stop the application');
console.log('-------------------------------------');

const server = spawn('node', ['server/index.js'], { stdio: 'inherit' });

server.on('error', (err) => {
  console.error('Failed to start server:', err);
});

server.on('close', (code) => {
  console.log(\`Server process exited with code \${code}\`);
});
`;
  
  fs.writeFileSync('dist/start.js', startScript);
  fs.chmodSync('dist/start.js', '755'); // Make executable
  printMessage('Created startup script', colors.green);
}

// Main function
function main() {
  printHeader('Building Enterprise App for Local Use');
  
  // Clean previous builds
  cleanBuild();
  
  // Build the application
  if (!buildApp()) {
    process.exit(1);
  }
  
  // Copy deployment files
  copyDeploymentFiles();
  
  // Create startup script
  createStartupScript();
  
  printHeader('Build Complete');
  printMessage('Your application is ready for offline use!', colors.green);
  printMessage('\nTo deploy:', colors.cyan);
  printMessage('1. Copy the "dist" directory to your target machine', colors.cyan);
  printMessage('2. Run "npm install" in the copied directory', colors.cyan);
  printMessage('3. Run "node start.js" to start the application', colors.cyan);
  printMessage('\nOr use "node scripts/local-setup.js" for a guided setup', colors.cyan);
}

// Run the main function
main();