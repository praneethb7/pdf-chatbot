import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    googleId: { type: String, required: true, unique: true },
    name: String,
    email: String,
});

export default mongoose.model("User",userSchema);

