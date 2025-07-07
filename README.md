# 🚀 AI Resume Builder

A modern, AI-powered resume builder that helps you create professional, ATS-friendly resumes with intelligent content enhancement and real-time preview.

![AI Resume Builder](https://img.shields.io/badge/AI-Powered-blue)
![React](https://img.shields.io/badge/React-18.x-blue)
![Node.js](https://img.shields.io/badge/Node.js-20.x-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black)

## ✨ Features

### 🤖 AI-Powered Enhancement
- **Smart Content Generation**: AI-powered content enhancement for all resume sections
- **Technical Term Formatting**: Automatic bold formatting for technical skills and technologies
- **Resume Upload & Extraction**: Upload existing resumes (PDF/DOCX) and extract structured data
- **Intelligent Suggestions**: Context-aware content improvements with retry logic

### 🎨 Modern User Experience
- **Real-time Preview**: Live resume preview with professional formatting
- **Multiple Creation Methods**: Manual creation or AI-powered extraction
- **Star Rating System**: Intuitive 5-star skill level indicators
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Clean Interface**: Minimal, uncluttered design focused on usability

### 🔧 Professional Features
- **ATS-Friendly Templates**: Optimized for Applicant Tracking Systems
- **Section Management**: Flexible resume sections (Summary, Experience, Formations, Skills, Projects, Certifications)
- **Theme Customization**: Multiple color themes and layouts
- **Export Options**: Download as PDF or view in browser
- **Progress Tracking**: Visual progress indicators for AI enhancement

### 🔐 Secure & Reliable
- **JWT Authentication**: Secure user authentication and session management
- **Data Persistence**: MongoDB database with reliable data storage
- **File Upload Security**: Secure file handling with validation
- **Error Handling**: Graceful error handling with user-friendly messages
- **Production Ready**: No fallback mechanisms, clean failure handling

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite for fast development
- **Redux Toolkit** for state management
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **React Router** for navigation
- **Sonner** for notifications

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Multer** for file uploads
- **PDF-Parse** for PDF text extraction
- **Mammoth** for DOCX text extraction

### AI Integration
- **Google Gemini AI** for content enhancement
- **Retry Logic** with exponential backoff
- **Smart Error Handling** for AI service availability

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB database (local or cloud)
- Google Gemini API key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/ai-resume-builder.git
cd ai-resume-builder
```

2. **Install Frontend Dependencies**
```bash
cd Frontend
npm install
```

3. **Install Backend Dependencies**
```bash
cd ../Backend
npm install
```

4. **Environment Configuration**

Create `.env` file in the Backend directory:
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/ai_resume_builder
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
ALLOWED_SITE=http://localhost:5173
```

Create `.env.local` file in the Frontend directory:
```env
VITE_GEMENI_API_KEY=your_gemini_api_key
VITE_APP_URL=http://localhost:5001/
```

5. **Start Development Servers**

Backend:
```bash
cd Backend
npm start
```

Frontend (in new terminal):
```bash
cd Frontend
npm run dev
```

6. **Access the Application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5001

## 📁 Project Structure

```
ai-resume-builder/
├── Frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── features/       # Redux slices
│   │   └── utils/          # Utility functions
│   ├── public/             # Static assets
│   └── package.json
├── Backend/                 # Node.js backend application
│   ├── src/
│   │   ├── controller/     # Route controllers
│   │   ├── models/         # MongoDB models
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Custom middleware
│   │   └── utils/          # Utility functions
│   ├── uploads/            # File upload directory
│   └── package.json
└── README.md
```

## 🌐 Production Deployment

### Vercel Deployment

1. **Frontend Deployment**
```bash
cd Frontend
vercel --prod
```

2. **Backend Deployment**
```bash
cd Backend
vercel --prod
```

3. **Environment Variables**
Set these in Vercel dashboard:
- `MONGODB_URI`
- `JWT_SECRET`
- `GEMINI_API_KEY`
- `ALLOWED_SITE`

## 🔧 Configuration

### MongoDB Setup
- Local: Install MongoDB and start service
- Cloud: Use MongoDB Atlas for production

### Gemini AI Setup
1. Get API key from Google AI Studio
2. Add to environment variables
3. Configure rate limits and quotas

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Gemini AI for content enhancement
- Tailwind CSS for styling framework
- Vercel for hosting platform
- MongoDB for database solution

## 📞 Support

For support, create an issue in this repository.

---

**Built with ❤️ for job seekers worldwide**