

require('dotenv').config()

const User = require("../models/Admin")
const router = require("express").Router();
const bcrypt = require("bcrypt")


router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        // console.log(user);
        if (!user) {
            res.status(404).json("User not found")
            return
        }

        res.status(200).json({_id: user._id, username: user.username, email: user.email, phone: user.phone})
    } catch(err) {
        res.status(500).json(err)
    }
})

//Register a new user

router.post("/register", async function(req, res) {
    try {
        const user = await User.findOne({email: req.body.email});

        const mobileExists = await User.findOne({phone: req.body.phone})
        
        if (!user && !mobileExists) {
    
            const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                phone: req.body.phone ? req.body.phone : "",
            })

            const salt = await bcrypt.genSalt(10);
            newUser.password = await bcrypt.hash(newUser.password, salt);

            await newUser.save();
            res.status(200).json("successfully registered")
        }

        else {
            res.json("This email/mobile is already registered.");
        }
    } catch(err) {
        res.json(err);
    }
});

router.post("/editUsername", async function(req, res) {

    try {
        const user = await User.findById(req.body._id);

        // console.log(req.body._id);
        // console.log(req.body.username);

        if (!user) {
            res.status(404).json("User not found")
        }

        await user.updateOne({username: req.body.username});

        await user.save()

        user.username = req.body.username

        res.status(200).json({_id: user._id, username: user.username, email: user.email, phone: user.phone, accessToken: user.accessToken, refreshToken: user.refreshToken})

    } catch(err) {
        console.log(err);
        res.json(err);
    }
});

module.exports = router;