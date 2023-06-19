require('dotenv').config()

const router = require("express").Router()
const Theme = require("../models/Theme")


router.post("/getTheme", async (req, res) => {
    try {

        const theme = await Theme.findOne({_id: "63a02d7101710767248ca5ac"});

        // console.log(theme)

        res.status(200).json(theme)

    } catch(err) {
        console.log(err);
        res.status(500).json(err)
    }
})

router.post("/", async (req, res) => {
    try {

        const theme = await Theme.findOne({_id: "63a02d7101710767248ca5ac"});

        await theme.updateOne({type: req.body.type, name: req.body.name})

        res.status(200).json(theme)

    } catch(err) {
        res.status(500).json(err)
        // console.log(err);
    }
})


module.exports = router