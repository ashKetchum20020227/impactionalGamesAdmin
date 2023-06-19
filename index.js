require('dotenv').config()

const express = require("express");
// const fileUpload = require('express-fileupload');
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const path = require("path");
const cloudinary = require("cloudinary")

cloudinary.config({ 
    cloud_name: 'dmquzvi22', 
    api_key: process.env.cloudinaryApiKey, 
    api_secret: process.env.cloudinaryApiSecret
});

app.use(express.json({ extended: false }));
app.use(cors());
// app.use(fileUpload()); 

try {
    mongoose.connect(
      process.env.MONGO_URL,
      { useNewUrlParser: true, useUnifiedTopology: true }
      ).then(() => {
      console.log("Mongo connected");
    });
} catch(err) {
    console.log(err);
}

const port = process.env.PORT || 5000;

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/build/index.html'));
    });
}

app.use("/api/games", require("./routes/games"))
app.use("/api/admins", require("./routes/admins"))
app.use("/api/auth", require("./routes/auth"))
app.use("/api/users", require("./routes/users"))
app.use("/api/transactions", require("./routes/transactions"))
app.use("/api/tournaments", require("./routes/tournaments"))
app.use("/api/visits", require("./routes/visits"))
app.use("/api/themes", require("./routes/themes"))

app.listen(port, function() {
    console.log("Server started on port " + port);
});