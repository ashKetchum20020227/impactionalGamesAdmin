
require('dotenv').config()

const Visit = require("../models/Visit")
const router = require("express").Router();


router.post("/addVisit", async (req, res) => {
    try {
        const newVisit = new Visit({
            userId: req.body.userId ? req.body.userId : "",
            place: req.body.place
        })

        await newVisit.save();
    } catch(err) {
        console.log(err);
    }
})

router.post("/getVisitDetailsToday", async (req, res) => {
    try {
        
        const visits = await Visit.find({createdAt: {$gte: {}}});

        res.status(200).send(visits)

    } catch(err) {
        console.log(err);
    }
})

module.exports = router;