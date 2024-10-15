const express = require('express');
const mongoose = require('mongoose');
const postRoutes = require('./routes/PostRoute');
const feedRoutes = require('./routes/FeedRoute');
require('dotenv').config();  // To use environment variables

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB Atlas
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Atlas connected successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB Atlas:', error.message);
    process.exit(1);
  }
};

// Call the connection function
connectDB();

// Routes
app.use('/api/posts', postRoutes);
app.use('/api/feed', feedRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
