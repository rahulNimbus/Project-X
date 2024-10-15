const express = require('express');
const router = express.Router();
const Post = require('../models/PostSchema');

// ... other user routes ...

// Route to create a new post
router.post('/create-post', async (req, res) => {
  try {
    const { userId, imageUrl, caption } = req.body;
    
    const newPost = new Post({
      image: imageUrl,
      caption: caption,
      owner: userId
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Error creating post', error: error.message });
  }
});

module.exports = router;