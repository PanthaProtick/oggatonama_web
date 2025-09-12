require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v2: cloudinary } = require("cloudinary");

const app = express();
const PORT = process.env.PORT || 5000;

// JWT Secret - Add this to your .env file: JWT_SECRET=your_secret_key_here
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key_change_in_production";

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'], // Allow both localhost and 127.0.0.1
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' })); // Increase payload limit for image uploads
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// MongoDB Connection
console.log("Attempting to connect to MongoDB...");
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    console.log(
      "⚠️  Server will continue running but database operations will fail"
    );
    console.log(
      "MONGO_URI from env:",
      process.env.MONGO_URI ? "Present" : "Missing"
    );
  });

// Mongoose Schema for Dead Body Registration
const RegisterSchema = new mongoose.Schema({
  foundLocation: String,
  age: Number,
  gender: String,
  height: String,
  clothing: String,
  photo: String,
  createdAt: { type: Date, default: Date.now },
});
const Register = mongoose.model("Register", RegisterSchema);

// Mongoose Schema for User Registration
const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  contactNumber: {
    type: String,
    required: true,
    trim: true
  },
  nidNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  profilePhoto: {
    type: String,
    required: true
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});
const User = mongoose.model("User", UserSchema);

// Multer setup for file uploads (using memory storage for Cloudinary)
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Test endpoint
app.get("/api/test", (req, res) => {
  res.json({
    message: "Backend is working!",
    timestamp: new Date().toISOString(),
  });
});

// Helper function to upload image to Cloudinary
const uploadToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: "image",
        folder: "oggatonama_uploads", // Organize uploads in a folder
        transformation: [
          { width: 800, height: 600, crop: "limit" }, // Resize large images
          { quality: "auto" }, // Optimize quality
          { format: "auto" } // Auto format (WebP when supported)
        ],
        ...options
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    ).end(buffer);
  });
};

// Register route
app.post("/api/register", upload.single("photo"), async (req, res) => {
  console.log("=== REGISTRATION REQUEST RECEIVED ===");
  console.log("Body:", req.body);
  console.log("File:", req.file ? "Photo uploaded" : "No photo");
  
  try {
    const { foundLocation, age, gender, height, clothing } = req.body;
    
    // Validate required fields
    if (!foundLocation || !age || !gender || !height || !clothing) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    let photoUrl = "";
    
    // Upload photo to Cloudinary if provided
    if (req.file) {
      console.log("📸 Uploading photo to Cloudinary...");
      try {
        const cloudinaryResult = await uploadToCloudinary(req.file.buffer, {
          public_id: `registration_${Date.now()}` // Unique filename
        });
        photoUrl = cloudinaryResult.secure_url;
        console.log("✅ Photo uploaded to Cloudinary:", photoUrl);
      } catch (uploadError) {
        console.error("❌ Cloudinary upload error:", uploadError);
        return res.status(500).json({ error: "Failed to upload image" });
      }
    }
    
    const newRegister = new Register({
      foundLocation,
      age: parseInt(age), // Ensure age is a number
      gender,
      height,
      clothing,
      photo: photoUrl, // Store Cloudinary URL instead of local path
    });
    
    console.log("💾 About to save to database:", {
      ...newRegister.toObject(),
      photo: photoUrl ? "Photo URL stored" : "No photo"
    });
    
    const savedRegister = await newRegister.save();
    
    console.log("✅ Registration saved successfully:", savedRegister._id);
    res.status(201).json({ 
      message: "Registration successful",
      id: savedRegister._id,
      photoUrl: photoUrl || null
    });
    
  } catch (err) {
    console.error("❌ Registration error:", err);
    console.error("Error stack:", err.stack);
    res.status(500).json({ error: "Server error: " + err.message });
  }
});

// User Signup endpoint
app.post("/api/signup", upload.single("profilePhoto"), async (req, res) => {
  try {
    console.log("📝 User signup request received at:", new Date().toISOString());
    console.log("Request headers:", req.headers);
    console.log("Request body:", req.body);
    console.log("File received:", req.file ? "Yes" : "No");
    if (req.file) {
      console.log("File details:", {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
      });
    }
    
    const { fullName, email, password, contactNumber, nidNumber } = req.body;
    
    // Validate required fields
    if (!fullName || !email || !password || !contactNumber || !nidNumber) {
      return res.status(400).json({ error: "All fields are required" });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { nidNumber }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        error: existingUser.email === email 
          ? "Email already registered" 
          : "NID number already registered" 
      });
    }
    
    let profilePhotoUrl = "";
    
    // Upload profile photo to Cloudinary
    if (req.file) {
      console.log("📸 Uploading profile photo to Cloudinary...");
      try {
        const cloudinaryResult = await uploadToCloudinary(req.file.buffer, {
          public_id: `profile_${Date.now()}`, // Unique filename
          folder: "oggatonama_profiles" // Separate folder for profile photos
        });
        profilePhotoUrl = cloudinaryResult.secure_url;
        console.log("✅ Profile photo uploaded to Cloudinary:", profilePhotoUrl);
      } catch (uploadError) {
        console.error("❌ Cloudinary upload error:", uploadError);
        return res.status(500).json({ error: "Failed to upload profile photo" });
      }
    } else {
      return res.status(400).json({ error: "Profile photo is required" });
    }
    
    // Hash password before saving
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      contactNumber,
      nidNumber,
      profilePhoto: profilePhotoUrl,
    });
    
    console.log("💾 About to save user to database:", {
      ...newUser.toObject(),
      password: "[HIDDEN]",
      profilePhoto: profilePhotoUrl ? "Photo URL stored" : "No photo"
    });
    
    const savedUser = await newUser.save();
    
    console.log("✅ User registered successfully:", savedUser._id);
    res.status(201).json({ 
      message: "Account created successfully",
      user: {
        id: savedUser._id,
        fullName: savedUser.fullName,
        email: savedUser.email,
        profilePhoto: savedUser.profilePhoto
      }
    });
    
  } catch (err) {
    console.error("❌ User signup error:", err);
    console.error("Error stack:", err.stack);
    
    // Handle duplicate key errors
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return res.status(400).json({ 
        error: `${field === 'email' ? 'Email' : 'NID number'} already exists` 
      });
    }
    
    res.status(500).json({ error: "Server error: " + err.message });
  }
});

// User Signin endpoint
app.post("/api/signin", async (req, res) => {
  try {
    console.log("🔐 User signin request received");
    const { email, password } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    
    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email,
        fullName: user.fullName 
      },
      JWT_SECRET,
      { expiresIn: '24h' } // Token expires in 24 hours
    );
    
    console.log("✅ User signed in successfully:", user._id);
    res.json({
      message: "Signin successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePhoto: user.profilePhoto,
        contactNumber: user.contactNumber,
        nidNumber: user.nidNumber
      }
    });
    
  } catch (err) {
    console.error("❌ User signin error:", err);
    res.status(500).json({ error: "Server error: " + err.message });
  }
});

// Get current user profile (protected route)
app.get("/api/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("❌ Get profile error:", err);
    res.status(500).json({ error: "Server error: " + err.message });
  }
});

// Update user profile (protected route)
app.put("/api/profile", authenticateToken, upload.single("profilePhoto"), async (req, res) => {
  try {
    const { fullName, contactNumber } = req.body;
    const userId = req.user.userId;
    
    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (contactNumber) updateData.contactNumber = contactNumber;
    
    // Handle profile photo update
    if (req.file) {
      try {
        const cloudinaryResult = await uploadToCloudinary(req.file.buffer, {
          public_id: `profile_${userId}_${Date.now()}`,
          folder: "oggatonama_profiles"
        });
        updateData.profilePhoto = cloudinaryResult.secure_url;
      } catch (uploadError) {
        console.error("❌ Cloudinary upload error:", uploadError);
        return res.status(500).json({ error: "Failed to upload profile photo" });
      }
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      userId, 
      updateData, 
      { new: true }
    ).select('-password');
    
    res.json({
      message: "Profile updated successfully",
      user: updatedUser
    });
    
  } catch (err) {
    console.error("❌ Profile update error:", err);
    res.status(500).json({ error: "Server error: " + err.message });
  }
});

// Get all registered entries
app.get("/api/register", async (req, res) => {
  try {
    const entries = await Register.find().sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get single entry by ID
app.get("/api/register/:id", async (req, res) => {
  try {
    const entry = await Register.findById(req.params.id);
    if (!entry) {
      return res.status(404).json({ error: "Entry not found" });
    }
    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
