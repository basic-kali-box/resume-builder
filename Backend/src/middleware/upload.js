import multer from "multer";
import path from "path";
import fs from "fs";

// Determine upload directory based on environment
const getUploadsDir = () => {
  if (process.env.NODE_ENV === 'production') {
    // In production (App Engine), use /tmp directory which is writable
    console.log("🏭 Production environment detected - using /tmp for uploads");
    return '/tmp';
  } else {
    // In development, use local uploads directory
    const localUploadsDir = path.join(process.cwd(), "uploads");
    console.log("🏠 Development environment detected - using local uploads directory");
    return localUploadsDir;
  }
};

const uploadsDir = getUploadsDir();

// Safely create uploads directory with error handling (only for development)
const ensureUploadsDir = () => {
  if (process.env.NODE_ENV !== 'production') {
    try {
      if (!fs.existsSync(uploadsDir)) {
        console.log(`📁 Creating uploads directory: ${uploadsDir}`);
        fs.mkdirSync(uploadsDir, { recursive: true });
        console.log("✅ Uploads directory created successfully");
      } else {
        console.log("📁 Uploads directory already exists");
      }
    } catch (error) {
      console.error("❌ Failed to create uploads directory:", error.message);
      console.error("📍 Attempted path:", uploadsDir);
    }
  } else {
    console.log("📁 Using /tmp directory for production uploads (no creation needed)");
  }
};

ensureUploadsDir();

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(`📁 Using upload directory: ${uploadsDir}`);
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, `resume-${uniqueSuffix}${extension}`);
  },
});

// File filter to accept only PDF and DOCX files
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only PDF and DOCX files are allowed."
      ),
      false
    );
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

export default upload;
