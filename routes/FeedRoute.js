const express = require('express');
const router = express.Router();
const User = require('../models/UserSchema');
const Post = require('../models/PostSchema');

router.get('/home-feed/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the current user
    const currentUser = await User.findById(userId);

    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get the list of users the current user is following
    const followingIds = currentUser.following;

    // Find the most recent post for each followed user
    const recentPosts = await Post.aggregate([
      {
        $match: {
          owner: { $in: followingIds }
        }
      },
      {
        $sort: { timestamp: -1 }
      },
      {
        $group: {
          _id: '$owner',
          post: { $first: '$$ROOT' }
        }
      },
      {
        $replaceRoot: { newRoot: '$post' }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'owner',
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