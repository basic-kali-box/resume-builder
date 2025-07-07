# Resume Upload and AI Extraction Feature

## Overview
This feature allows users to upload existing resume files (PDF or DOCX) and automatically extract structured data using AI, streamlining the resume creation process.

## Features

### 1. File Upload Support
- **Supported Formats**: PDF and DOCX files
- **File Size Limit**: 10MB maximum
- **Validation**: Automatic file type and size validation
- **Progress Feedback**: Real-time upload progress indicator

### 2. AI Data Extraction
- **Powered by**: Google Gemini AI
- **Extracts**:
  - Personal details (name, email, phone, address, job title)
  - Professional summary
  - Work experience with job descriptions
  - Education history
  - Skills with ratings
  - Projects and descriptions

### 3. Smart Form Population
- **Automatic Population**: All form fields are pre-filled with extracted data
- **Baseline Content**: Extracted data serves as baseline for AI enhancement features
- **Review & Edit**: Users can review and modify extracted data before saving
- **AI Enhancement**: Existing AI improvement features work with extracted content

### 4. User Experience
- **Dual Creation Mode**: Choose between blank resume or file upload
- **Progress Indicators**: Clear feedback during upload and processing
- **Error Handling**: Comprehensive error messages and fallback options
- **Success Notifications**: Clear confirmation when extraction succeeds

## Technical Implementation

### Backend Components

#### 1. File Upload Middleware (`Backend/src/middleware/upload.js`)
- Multer configuration for file handling
- File type validation (PDF/DOCX only)
- Size limit enforcement (10MB)
- Secure file storage in uploads directory

#### 2. Extraction Service (`Backend/src/services/fileExtraction.service.js`)
- PDF text extraction using `pdf-parse`
- DOCX text extraction using `mammoth`
- AI-powered data structuring with Gemini
- Comprehensive error handling and validation

#### 3. API Endpoint (`Backend/src/controller/resume.controller.js`)
- `POST /api/resumes/createResumeFromUpload`
- File processing and AI extraction
- Resume creation with extracted data
- Error handling for various failure scenarios

### Frontend Components

#### 1. Enhanced AddResume Component (`Frontend/src/pages/dashboard/components/AddResume.jsx`)
- Dual creation mode selection
- File upload interface with drag-and-drop
- Progress indicators and loading states
- Comprehensive error handling and user feedback

#### 2. Updated EditResume Component (`Frontend/src/pages/dashboard/edit-resume/[resume_id]/EditResume.jsx`)
- Detection of extracted resume data
- Success notification for uploaded resumes
- Seamless integration with existing form components

#### 3. API Service (`Frontend/src/Services/resumeAPI.js`)
- `createResumeFromUpload` function
- FormData handling for file uploads
- Error handling and response processing

## Setup Instructions

### 1. Backend Setup
1. Install required dependencies:
   ```bash
   cd Backend
   npm install multer pdf-parse mammoth @google/generative-ai
   ```

2. Add Gemini API key to `.env`:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. Ensure uploads directory exists (created automatically)

### 2. Frontend Setup
No additional dependencies required - uses existing UI components and services.

## Usage Flow

### 1. User Initiates Resume Creation
- User clicks "Create New Resume" button
- Dialog opens with two options: "Start Blank" or "Upload Resume"

### 2. File Upload Process
- User selects "Upload Resume" mode
- User enters resume title
- User selects PDF or DOCX file
- File validation occurs (type and size)
- User clicks "Upload & Create"

### 3. AI Processing
- File is uploaded to backend
- Text is extracted from PDF/DOCX
- AI processes text and structures data
- Resume is created with extracted data
- User is redirected to edit page

### 4. Review and Enhancement
- User reviews auto-populated form fields
- User can edit any extracted information
- User can use existing AI enhancement features
- User saves and continues with normal workflow

## Error Handling

### File Upload Errors
- **Invalid file type**: Clear message about supported formats
- **File too large**: Specific size limit information
- **Corrupted files**: Guidance to try different file
- **Network errors**: Retry suggestions

### Extraction Errors
- **No readable text**: Guidance about image-based PDFs
- **AI processing failure**: Fallback to manual entry
- **Partial extraction**: User can fill missing fields
- **Server errors**: Clear error messages and retry options

## AI Enhancement Integration

The extracted data seamlessly integrates with existing AI enhancement features:

### 1. Summary Enhancement
- Extracted summary serves as baseline
- AI can improve and optimize the summary
- User maintains control over final content

### 2. Experience Descriptions
- Extracted job descriptions are enhanced
- AI improves language and structure
- Original achievements are preserved

### 3. Education Descriptions
- Extracted education details are enhanced
- AI adds professional language
- Key information is maintained

### 4. Skills and Projects
- Extracted skills are organized and rated
- Project descriptions are enhanced
- Technical details are preserved

## Security Considerations

### 1. File Handling
- Files are temporarily stored and automatically deleted
- No permanent storage of uploaded files
- Secure file validation and processing

### 2. Data Privacy
- Extracted text is processed securely
- No data is stored beyond resume creation
- User maintains full control over extracted data

### 3. API Security
- Authentication required for all endpoints
- File size and type restrictions enforced
- Rate limiting and error handling

## Future Enhancements

### 1. Additional File Formats
- Support for RTF files
- Support for TXT files
- Image-based PDF processing (OCR)

### 2. Enhanced AI Processing
- Better context understanding
- Industry-specific extraction
- Multi-language support

### 3. Batch Processing
- Multiple file upload
- Resume comparison features
- Template suggestions based on content

## Troubleshooting

### Common Issues

1. **"No readable text found"**
   - File might be image-based PDF
   - Try converting to text-based PDF
   - Use manual entry as fallback

2. **"AI processing failed"**
   - Check Gemini API key configuration
   - Verify network connectivity
   - Try again or use blank resume option

3. **"File upload failed"**
   - Check file size (must be < 10MB)
   - Verify file format (PDF or DOCX only)
   - Check network connection

### Support
For technical issues or questions about this feature, please refer to the main project documentation or contact the development team.
