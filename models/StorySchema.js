const mongoose = require("mongoose");
const { Schema } = mongoose;

const StorySchema = new Schema({
  user: {
    id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    username: { type: String, required: true },
  },
  filePath: {
    type: String,
    required: true,
  },
  expires: {
    type: Date,
    default: () => Date.now() + 24 * 60 * 60 * 1000,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
  viewers: [
    {
      userId: { type: Schema.Types.ObjectId, ref: "User" },
      seenAt: { type: Date, default: Date.now },
    },
  ],
  reactions: [
    {
      userId: { type: Schema.Types.ObjectId, ref: "User" },
      reactionType: {
        type: String,
      },
      reactedAt: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("Story", StorySchema);
