const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
    username: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
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
    }
}, 
{ timestamps: true }
);

module.exports = mongoose.model("Admin", AdminSchema);