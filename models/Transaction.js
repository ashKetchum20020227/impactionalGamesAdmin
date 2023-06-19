const mongoose = require("mongoose")

const TransactionSchema = new mongoose.Schema({
    publicAddress: {
        type: String
    },
    mgp: {
        type: String
    },
    amount: {
        type: String
    },
    hashKey: {
        type: String
    },
    userId: {
        type: String
    }, 
    username: {
        type: String
    }, 
    transactionType: {
        type: String
    },
    paymentMode: {
        type: String
    }
}, {timestamps: true}
)

module.exports = mongoose.model("Transaction", TransactionSchema)