const express = require("express");
const DecodeToken = require("../middlewares/DecodeToken");
const uploadStory = require("../middlewares/Multer-Stories");
const router = express.Router();

router.get(
  "/story/upload",
  //   , DecodeToken
  uploadStory.single("storyImage"),
  async (req, res) => {
    res.send("hi");
  }
);

module.exports = router;
