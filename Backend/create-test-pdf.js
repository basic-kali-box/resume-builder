// Simple script to test PDF parsing
import fs from 'fs';
import { extractTextFromPDF } from './src/services/fileExtraction.service.js';

// Test the PDF extraction with a real PDF file
async function testPdfExtraction() {
  console.log('Testing PDF extraction...');
  
  // You would need to place a real PDF file here for testing
  const testPdfPath = './test-resume.pdf';
  
  if (fs.existsSync(testPdfPath)) {
    try {
      const extractedText = await extractTextFromPDF(testPdfPath);
      console.log('Extracted text:', extractedText.substring(0, 500) + '...');
    } catch (error) {
      console.error('Error:', error.message);
    }
  } else {
    console.log('No test PDF file found. Please place a PDF file at:', testPdfPath);
  }
}

// Run test
testPdfExtraction();
