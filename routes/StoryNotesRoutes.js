const express = require("express");
const DecodeToken = require("../middlewares/DecodeToken");
const uploadStory = require("../middlewares/Multer-Stories");
const UserSchema = require("../models/UserSchema"); // Make sure to import UserSchema
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Stories
 *   description: Story management
 */

/**
 * @swagger
 * /api/story/upload:
 *   post:
 *     summary: Upload a story
 *     tags: [Stories]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               storyImage:
 *                 type: string
 *                 format: binary
 *     security:
 *       - cookieAuth: []  # Assuming you are using JWT in cookies
 *     responses:
 *       200:
 *         description: Story uploaded successfully
 *       400:
 *         description: No image provided
 *       401:
 *         description: User not found
 */
router.post(
  "/story/upload",
  DecodeToken,
  uploadStory.single("storyImage"),
  async (req, res) => {
    try {
      const user = await UserSchema.findById(req.user.userId); // Use req.user.userId to get the ID
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }
      if (!req.file) {
        return res.status(400).json({ error: "No image/video provided." });
      }
      // Handle your story saving logic here
      res.send("Story uploaded successfully");
    } catch (error) {
      console.error("Error uploading story:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

module.exports = router;
