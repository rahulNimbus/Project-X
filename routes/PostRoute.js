const express = require('express');
const router = express.Router();
const Post = require('../models/PostSchema');

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Post management
 */

/**
 * @swagger
 * /api/posts/create-post:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               caption:
 *                 type: string
 *             required:
 *               - userId
 *               - imageUrl
 *               - caption
 *     responses:
 *       201:
 *         description: Post created successfully
 *       500:
 *         description: Error creating post
 */
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
