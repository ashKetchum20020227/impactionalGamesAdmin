
const mongoose = require("mongoose")

const VisitSchema = new mongoose.Schema({
    userId: {
        type: String
    },
    place: {
        type: String
    }
}, 
{ timestamps: true }
);

module.exports = mongoose.model("Visit", VisitSchema);