
const mongoose = require("mongoose")

const RefreshTokenSchema = new mongoose.Schema({
    refreshToken: {
        type: String
    },
    expireAt: {
        type: Date,
        default: Date.now,
        expires: 900,
    },
}, 
{ timestamps: true }
);

module.exports = mongoose.model("RefreshToken", RefreshTokenSchema);