const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    blocked: {
        type: String,
        default: "0"
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type:String,
        unique: true
    },
    refreshToken: {
        type: String
    },
    reviews: {
        type: Array,
        default: []
    },
    likedGames: {
        type: Array,
        default: []
    },
    history: {
        type: Array,
        default: []
    },
    profileLikes: {
        type: Array,
        default: []
    }
}, 
{ timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);