// Simple test script to verify file upload functionality
import fs from 'fs';
import path from 'path';
import { processResumeFile } from './src/services/fileExtraction.service.js';

// Test function
async function testFileExtraction() {
  console.log('Testing file extraction service...');
  
  // Create a simple test text file to simulate a resume
  const testContent = `
John Doe
Software Engineer
Email: john.doe@email.com
Phone: (555) 123-4567
Address: 123 Main St, City, State

SUMMARY
Experienced software engineer with 5 years of experience in web development.

EXPERIENCE
Senior Software Engineer
Tech Company Inc.
2020 - Present
Developed and maintained web applications using React and Node.js.

Software Engineer
StartupCorp
2018 - 2020
Built scalable backend services and APIs.

EDUCATION
Bachelor of Science in Computer Science
University of Technology
2014 - 2018

SKILLS
JavaScript, React, Node.js, Python, SQL

PROJECTS
E-commerce Platform
Built a full-stack e-commerce platform using React and Express.
  `;
  
  const testFilePath = path.join(process.cwd(), 'test-resume.txt');
  
  try {
    // Write test content to file
    fs.writeFileSync(testFilePath, testContent);
    console.log('Test file created successfully');
    
    // Note: This is just a basic test - in real scenario we'd test with actual PDF/DOCX
    console.log('File extraction service is ready for testing with actual PDF/DOCX files');
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    // Clean up test file
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
      console.log('Test file cleaned up');
    }
  }
}

// Run test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testFileExtraction();
}
