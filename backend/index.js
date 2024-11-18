const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: 'http://localhost:3000', // React app ka URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Token Verification Middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from "Bearer <token>"

  if (!token) return res.status(403).json({ message: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid token" });

    req.adminId = decoded.id; // Attach admin ID to request
    req.adminEmail = decoded.email; // Attach admin Email to request
    next();
  });
};

// MongoDB Connection
const mongoURI = process.env.MONGO_URI;
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Admin Schema
const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Plain text password
});

const Admin = mongoose.model("Admin", adminSchema);

// API: Admin Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    if (password !== admin.password)
      return res.status(401).json({ message: "Invalid credentials" });

    // Generate token with admin's id and email
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Blog Schema and Model
const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true }, // Link with admin
});

const Blog = mongoose.model('Blog', blogSchema);

// API Routes for Blogs
// Create a new blog
app.post("/api/blogs", verifyToken, async (req, res) => {
  try {
    const { title, content } = req.body;

    const newBlog = new Blog({
      title,
      content,
      createdBy: req.adminId, // Associate with admin ID
    });

    await newBlog.save();
    res.status(201).json({ message: "Blog created successfully!", blog: newBlog });
  } catch (error) {
    res.status(500).json({ message: "Error creating blog", error: error.message });
  }
});


// New API to fetch all blogs (for UserDashboard)
app.get("/api/all-blogs", async (req, res) => {
  try {
    const blogs = await Blog.find(); // Get all blogs
    res.status(200).json(blogs); // Send blogs as response
  } catch (error) {
    res.status(500).json({ message: "Error fetching all blogs", error: error.message });
  }
});


app.get("/api/blogs", verifyToken, async (req, res) => {
  try {
    const blogs = await Blog.find({ createdBy: req.adminId }); // Fetch blogs created by the logged-in admin
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching blogs", error: error.message });
  }
});




// Get a single blog by ID
app.get("/api/blogs/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id); // Find the blog by ID
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json(blog); // Send the found blog as response
  } catch (error) {
    res.status(500).json({ message: "Error fetching blog" });
  }
});

// Update blog by ID
app.put("/api/blogs/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { title, content },
      { new: true, runValidators: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json({
      message: "Blog updated successfully!",
      blog: updatedBlog,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating blog",
      error: error.message,
    });
  }
});

// Delete blog by ID
app.delete("/api/blogs/:id", verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedBlog = await Blog.findByIdAndDelete(id);

    if (!deletedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json({
      message: "Blog deleted successfully!",
      blog: deletedBlog, // Optional: return deleted blog data
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting blog",
      error: error.message,
    });
  }
});




// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
