const express = require("express");
const mongoose = require("mongoose");
const postRoutes = require("./routes/PostRoute");
const feedRoutes = require("./routes/FeedRoute");
const userRoutes = require('./routes/UserRoute'); 
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

// Middleware to parse JSON bodies

// Connect to MongoDB Atlas
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Atlas connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB Atlas:", error.message);
  }
};

// Call the connection function
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Routes

app.get("/", (req, res) => {
  res.send("<h1>Happy to see you here!</h1>");
});

app.use("/api/posts", postRoutes);
app.use("/api/feed", feedRoutes);
app.use("/api/story&notes", require("./routes/StoryNotesRoutes"));
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
