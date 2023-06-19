require('dotenv').config()

const router = require("express").Router()
const Tournament = require("../models/Tournament")

router.post("/addTournament", async (req, res) => {
    try {
        const newTournament = new Tournament({
            gameId: req.body.gameId,
            minPlayers: req.body.minPlayers,
            maxPlayers: req.body.maxPlayers,
            entryAmount: req.body.entryAmount,
            winnerPercentage: req.body.winnerPercentage,
            runnerPercentage: req.body.runnerPercentage
        })

        await newTournament.save()

        const tournaments = await Tournament.find({gameId: req.body.gameId})

        res.status(200).json(tournaments)

    } catch(err) {
        res.status(500).json("Error")
    }
})

router.post("/getTournaments", async (req, res) => {
    try {
        
        const tournaments = await Tournament.find({gameId: req.body.gameId})
        
        res.status(200).json(tournaments)

    } catch(err) {
        res.status(500).json("Error")
    }
})

module.exports = router;