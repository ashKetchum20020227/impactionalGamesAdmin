
require('dotenv').config()

const Transaction = require("../models/Transaction")
const router = require("express").Router();
const bcrypt = require("bcrypt");

router.post("/getAllTransactions", async (req, res) => {
    try {

        const transactions = await Transaction.find({userId: req.body.userId})

        res.status(200).json(transactions)

    } catch(err) {
        console.log(err);
        res.status(500).json(err)
    }
})

router.post("/liveTransactions", async (req, res) => {
    try {

        const transactions = await Transaction.find()

        res.status(200).json(transactions)

    } catch(err) {
        console.log(err);
        res.status(500).json(err)
    }
})


router.post("/addTransaction", async (req, res) => {
    try {

        const transaction = new Transaction({
            userId: req.body.userId,
            username: req.body.username,
            amount: req.body.amount,
            transactionType: req.body.transactionType,
            paymentMode: req.body.paymentMode
        })

        await transaction.save()

        res.status(200).json("Success")

    } catch(err) {
        console.log(err);
        res.status(500).json(err)
    }
})

module.exports = router