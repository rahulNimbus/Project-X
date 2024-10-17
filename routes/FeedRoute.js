const express = require('express');
const router = express.Router();
const User = require('../models/UserSchema');
const Post = require('../models/PostSchema');
const mongoose = require('mongoose');

/**
 * @swagger
 * tags:
 *   name: Feed
 *   description: Feed management
 */

/**
 * @swagger
 * /api/feed/home-feed/{userId}:
 *   get:
 *     summary: Get home feed for a user
 *     tags: [Feed]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response with recent posts
 *       404:
 *         description: User not found
 *       500:
 *         description: Error fetching home feed
 */
router.get('/home-feed/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the current user
    const currentUser = await User.findById(userId);

    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get the list of users the current user is following and ensure ObjectId type
    const followingIds = currentUser.following.map(id => new mongoose.Types.ObjectId(id));

    // Find the most recent post for each followed user
    const recentPosts = await Post.aggregate([
      {
        $match: {
          user: { $in: followingIds } // Changed 'owner' to 'user' to match the schema
        }
      },
      {
        $sort: { timestamp: -1 }
      },
      {
        $group: {
          _id: '$user', // Group by 'user' instead of 'owner'
          post: { $first: '$$ROOT' }
        }
      },
      {
        $replaceRoot: { newRoot: '$post' }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user', // Changed from 'owner' to 'user'
          foreignField: '_id',
          as: 'ownerDetails'
        }
      },
      {
        $unwind: '$ownerDetails'
      },
      {
        $project: {
          _id: 1,
          image: 1,
          caption: 1,
          timestamp: 1,
          likes: 1,
          comments: 1,
          shareCount: 1,
          'ownerDetails._id': 1,
          'ownerDetails.username': 1
        }
      }
    ]);

    res.json(recentPosts);
  } catch (error) {
    console.error('Error fetching home feed:', error);
    res.status(500).json({ message: 'Error fetching home feed', error: error.message });
  }
});

module.exports = router;
