require('dotenv').config()

const router = require("express").Router()
const Game = require("../models/Game")
const multer = require('multer');

const uploader = multer({
  storage: multer.diskStorage({}),
  limits: { fileSize: 500000 }
});

const cloudinary = require("cloudinary")

cloudinary.config({ 
    cloud_name: 'dmquzvi22', 
    api_key: process.env.cloudinaryApiKey, 
    api_secret: process.env.cloudinaryApiSecret
});


router.post("/add", uploader.single("file"), async (req, res) => {
    try {

        // console.log(req.body)
        // console.log(req.file)

        const upload = await cloudinary.v2.uploader.upload(req.file.path);

        const newGame = new Game({
            name: req.body.name,
            iframeLink: req.body.iframeLink,
            about: req.body.about,
            owner: req.body.owner,
            release: req.body.release,
            icon: upload.secure_url
        })

        await newGame.save()

        res.status(200).json("Success")

    } catch(err) {
        console.log(err);
        res.status(500).json("Error")
    }
})

router.post("/getAllGames", async (req, res) => {
    try {

        const games = await Game.find()

        res.status(200).json(games)

    } catch(err) {
        res.status(500).json("Error")
    }
})

router.post("/delete", async (req, res) => {
    try {

        await Game.deleteOne({_id: req.body.gameId})

        const games = await Game.find()

        res.status(200).json(games)

    } catch(err) {
        res.status(500).json("Error")
    }
})

module.exports = router;