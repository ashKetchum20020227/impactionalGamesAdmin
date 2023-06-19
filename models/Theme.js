
const mongoose = require("mongoose")

const ThemeSchema = new mongoose.Schema({

    type: {
        type: String,
        default: "0"
    },

    name: {
        type: String,
        default: "None"
    }
})

module.exports = mongoose.model("Theme", ThemeSchema);