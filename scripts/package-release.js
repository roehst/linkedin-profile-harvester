#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get version from manifest
const manifestPath = path.join(__dirname, '..', 'dist', 'manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const version = manifest.version;

// Define output path
const releaseDir = path.join(__dirname, '..', 'releases');
const zipName = `linkedin-profile-harvester-v${version}.zip`;
const zipPath = path.join(releaseDir, zipName);

// Create releases directory if it doesn't exist
if (!fs.existsSync(releaseDir)) {
  fs.mkdirSync(releaseDir, { recursive: true });
}

// Check if dist directory exists
const distPath = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(distPath)) {
  console.error('Error: dist directory not found. Run "npm run build" first.');
  process.exit(1);
}

console.log(`📦 Packaging extension v${version}...`);

try {
  // Remove old zip if it exists
  if (fs.existsSync(zipPath)) {
    fs.unlinkSync(zipPath);
    console.log(`   Removed old ${zipName}`);
  }

  // Create zip file using the system zip command
  // We need to cd into dist to avoid including the dist folder in the zip paths
  process.chdir(distPath);
  execSync(`zip -r "${zipPath}" . -x "*.DS_Store" -x "__MACOSX" -x "*.map"`, {
    stdio: 'inherit'
  });

  console.log(`✅ Release package created: ${zipPath}`);
  console.log(`\n📝 Installation instructions for users:`);
  console.log(`   1. Download ${zipName}`);
  console.log(`   2. Extract the ZIP file`);
  console.log(`   3. Open Chrome and go to chrome://extensions/`);
  console.log(`   4. Enable "Developer mode"`);
  console.log(`   5. Click "Load unpacked"`);
  console.log(`   6. Select the extracted folder`);
  console.log(`\n📤 You can now distribute the releases/${zipName} file to users.`);

} catch (error) {
  console.error('Error creating release package:', error.message);
  process.exit(1);
}
