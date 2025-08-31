require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
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

// Mongoose Schema
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

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Test endpoint
app.get("/api/test", (req, res) => {
  res.json({
    message: "Backend is working!",
    timestamp: new Date().toISOString(),
  });
});

// Register route
app.post("/api/register", upload.single("photo"), async (req, res) => {
  console.log("=== REGISTRATION REQUEST RECEIVED ===");
  console.log("Body:", req.body);
  console.log("File:", req.file);
  
  try {
    const { foundLocation, age, gender, height, clothing } = req.body;
    
    // Validate required fields
    if (!foundLocation || !age || !gender || !height || !clothing) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    const photo = req.file ? `/uploads/${req.file.filename}` : "";
    
    const newRegister = new Register({
      foundLocation,
      age: parseInt(age), // Ensure age is a number
      gender,
      height,
      clothing,
      photo,
    });
    
    console.log("About to save to database:", newRegister);
    
    const savedRegister = await newRegister.save();
    
    console.log("✅ Registration saved successfully:", savedRegister._id);
    res.status(201).json({ 
      message: "Registration successful",
      id: savedRegister._id 
    });
    
  } catch (err) {
    console.error("❌ Registration error:", err);
    console.error("Error stack:", err.stack);
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
