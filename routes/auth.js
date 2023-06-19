
require('dotenv').config()

const User = require("../models/Admin")
const router = require("express").Router();
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const RefreshToken = require("../models/RefreshToken")


const verify = (req, res, next) => {
    const authHeader = req.headers.authorization
    
    if (!authHeader) {
        res.status(401).json("You aren't authorized")
    } else {
        const token = authHeader.split(" ")[1]
        jwt.verify(token, process.env.accessTokenSecretKey, (err, user) => {
            if (err) {
                res.status(401).json("You aren't authorized")
            } else {
                req.user = user;
                next()
            }
        })
    }
}

router.post("/refresh", async (req, res) => {
    const refreshToken = req.body.refreshToken

    // console.log(refreshToken);

    const isValid = await RefreshToken.findOne({refreshToken: req.body.refreshToken})

    if (!isValid) {
        // console.log("h1");
        return res.status(403).json("You aren't authenticated");
    }

    if (!refreshToken) {
        // console.log("h2");
        return res.status(403).json("You aren't authenticated")
    } 

    jwt.verify(refreshToken, process.env.refreshTokenSecretKey, async (err, user) => {
        if (err) {
            // console.log("h3");
            return res.status(403).json("You aren't authenticated")
        } else {
            const newAccessToken = jwt.sign({_id: user._id, username: user.username, email: user.email, phone: user.phone}, process.env.accessTokenSecretKey, {expiresIn: "300s"})
            const newRefreshToken = jwt.sign({_id: user._id, username: user.username, email: user.email, phone: user.phone}, process.env.refreshTokenSecretKey)
            
            const dbUser = await User.findById(user._id)
            await dbUser.updateOne({refreshToken: newRefreshToken})
            await dbUser.save()

            await isValid.updateOne({refreshToken: newRefreshToken})

            await isValid.save()

            // const newRefreshTokenDB = new RefreshToken({
            //     refreshToken: newRefreshToken
            // })

            // await newRefreshTokenDB.save()

            res.json({_id: dbUser._id, username: dbUser.username, email: dbUser.email, phone: dbUser.phone, accessToken: newAccessToken, refreshToken: newRefreshToken});
        }
    })
})

router.post("/login/email", async function(req, res) {
    try {
        const user = await User.findOne({email: req.body.email});

        if (!user) {
            res.json("Email not registered. Create an account and try again");
        }

        else {
            const validPassword = await bcrypt.compare(req.body.password, user.password);
            if (!validPassword) {
                res.json("Password is incorrect");
            } else {
                const accessToken = jwt.sign({_id: user._id, username: user.username, email: user.email, phone: user.phone}, process.env.accessTokenSecretKey, {expiresIn: "20s"})
                const refreshToken = jwt.sign({_id: user._id, username: user.username, email: user.email, phone: user.phone}, process.env.refreshTokenSecretKey)
                await user.updateOne({refreshToken: refreshToken})
                await user.save()
                
                const newRefreshToken = new RefreshToken({
                    refreshToken: refreshToken
                })

                await newRefreshToken.save()

                res.json({_id: user._id, username: user.username, email: user.email, phone: user.phone, accessToken: accessToken, refreshToken: refreshToken});
            }
        }

    } catch(err) {
        console.log(err);
        res.json(err)
    }
})

router.post("/login/mobile", async function(req, res) {
    try {
        // console.log(req.body);
        const user = await User.findOne({mobile: req.body.mobile});
        // console.log(user);
        if (!user) {
            res.json("Mobile not registered. Create an account and try again");
        }

        else {
            if (process.env.firebaseApiKey != req.body.user.apiKey) {
                return res.status(403).json("You aren't authorized")
            }
            const accessToken = jwt.sign({_id: user._id, username: user.username, email: user.email, phone: user.phone}, process.env.accessTokenSecretKey, {expiresIn: "20s"})
            const refreshToken = jwt.sign({_id: user._id, username: user.username, email: user.email, phone: user.phone}, process.env.refreshTokenSecretKey)
            await user.updateOne({refreshToken: refreshToken})
            await user.save()

            const newRefreshToken = new RefreshToken({
                refreshToken: refreshToken
            })

            await newRefreshToken.save()

            res.json({_id: user._id, username: user.username, email: user.email, phone: user.phone, accessToken: accessToken, refreshToken: refreshToken});
        }

    } catch(err) {
        console.log(err);
        res.json(err)
    }
})

module.exports = router;

