const mongoose = require("mongoose")

const TournamentSchema = new mongoose.Schema({
    gameId: {
        type: String
    },
    minPlayers: {
        type: String
    },
    maxPlayers: {
        type: String
    },
    entryAmount: {
        type: String
    },
    winnerPercentage: {
        type: String
    },
    runnerPercentage: {
        type: String
    }
})

module.exports = mongoose.model("Tournament", TournamentSchema)