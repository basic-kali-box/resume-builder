#!/usr/bin/env node

/**
 * Smart build script that detects environment and builds accordingly
 * - Local: Builds frontend from ../Frontend and moves to public/
 * - Cloud: Assumes frontend is already built and in public/
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frontendPath = path.join(__dirname, '..', 'Frontend');
const publicPath = path.join(__dirname, 'public');

console.log('🔍 Checking build environment...');

// Check if we're in a local environment (Frontend directory exists)
if (fs.existsSync(frontendPath)) {
  console.log('📁 Local environment detected - Frontend directory found');
  console.log('🏗️ Building frontend from source...');
  
  try {
    // Build frontend
    console.log('📦 Running npm run build in Frontend directory...');
    execSync('npm run build', { 
      cwd: frontendPath, 
      stdio: 'inherit' 
    });
    
    // Move built files to backend public directory
    console.log('📂 Moving built files to Backend/public...');
    
    // Remove existing public directory
    if (fs.existsSync(publicPath)) {
      execSync('rm -rf public', { 
        cwd: __dirname, 
        stdio: 'inherit' 
      });
    }
    
    // Copy dist to public
    const distPath = path.join(frontendPath, 'dist');
    execSync(`cp -r "${distPath}" public`, { 
      cwd: __dirname, 
      stdio: 'inherit' 
    });
    
    console.log('✅ Frontend build completed successfully!');
    
  } catch (error) {
    console.error('❌ Frontend build failed:', error.message);
    process.exit(1);
  }
  
} else {
  console.log('☁️ Cloud environment detected - Frontend directory not found');
  
  // Check if public directory exists with built files
  if (fs.existsSync(publicPath)) {
    const indexPath = path.join(publicPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      console.log('✅ Frontend already built and available in public/ directory');
      console.log('📁 Public directory contents:');
      
      try {
        const files = fs.readdirSync(publicPath);
        files.forEach(file => {
          console.log(`   - ${file}`);
        });
      } catch (error) {
        console.log('   (Could not list files)');
      }
      
    } else {
      console.error('❌ Public directory exists but no index.html found');
      console.error('   This suggests the frontend was not properly built');
      process.exit(1);
    }
  } else {
    console.error('❌ No public directory found and no Frontend source available');
    console.error('   Please ensure frontend is built before deployment');
    process.exit(1);
  }
}

console.log('🎉 Build process completed successfully!');
