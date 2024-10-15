const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Plain password
    phoneNo: { type: String, required: true },
    age: { type: Number, required: true },
    following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

module.exports = mongoose.model("User", UserSchema);
