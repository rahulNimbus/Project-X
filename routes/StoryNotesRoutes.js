const express = require("express");
const DecodeToken = require("../middlewares/DecodeToken");
const uploadStory = require("../middlewares/Multer-Stories");
const router = express.Router();

router.get(
  "/story/upload",
  //   , DecodeToken
  uploadStory.single("storyImage"),
  async (req, res) => {
    let user = await UserSchema.findById(req.user);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
    if (!req.file) {
      return res.status(400).json({ error: "No image/video provided." });
    }
    res.send("hi");
  }
);

module.exports = router;
