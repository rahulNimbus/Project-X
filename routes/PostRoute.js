const express = require('express');
const router = express.Router();
const Post = require('../models/PostSchema');
const User = require('../models/UserSchema'); // Assuming you have a User model to validate userId

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
 *       400:
 *         description: Invalid userId
 *       500:
 *         description: Error creating post
 */
router.post('/create-post', async (req, res) => {
  try {
    const { userId, imageUrl, caption } = req.body;

    // Validate if userId exists in the User collection
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: 'Invalid userId' });
    }

    const newPost = new Post({
      image: imageUrl,
      caption: caption,
      user: userId // Change `owner` to `user`
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Error creating post', error: error.message });
  }
});


module.exports = router;
