require('dotenv').config()

const User = require("../models/User")
const router = require("express").Router();
const bcrypt = require("bcrypt")
const Visit = require("../models/Visit")
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

async function isLeapYear(year) {
    return year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0);
}

async function days_of_a_year(year) 
{
    return await isLeapYear(year) ? 366 : 365;
}



router.post("/timepass", uploader.single("file"), async (req, res) => {
    console.log(req.body)
    const upload = await cloudinary.v2.uploader.upload(req.file.path);
    console.log(upload)
    return res.json({
      success: true,
      file: upload.secure_url,
    });
  });


router.post("/blockUser", async (req, res) => {
    try {
        var user = await User.findOne({_id: req.body.userId})
        if (user.blocked == "0") {
            await user.updateOne({blocked: "1"})
            user = await User.findOne({_id: req.body.userId})
            res.status(200).json({_id: user._id, username: user.username, email: user.email, phone: user.phone, likedGames: user.likedGames, history: user.history, profileLikes: user.profileLikes, blocked: user.blocked})
            return;
        }

        await user.updateOne({blocked: "0"})

        user = await User.findOne({_id: req.body.userId})

        res.status(200).json({_id: user._id, username: user.username, email: user.email, phone: user.phone, likedGames: user.likedGames, history: user.history, profileLikes: user.profileLikes, blocked: user.blocked})

    } catch(err) {
        res.status(500).json(err)
    }
})

router.post("/deleteUser", async (req, res) => {
    try {
        const user = await User.findOne({_id: req.body.userId})
        
        await user.delete();

        res.status(200).json("Deleted")

    } catch(err) {
        res.status(500).json(err)
    }
})

router.post("/timepass", async (req, res) => {
    try {
        
        const users = await User.find()

        for (var i = 0; i < users.length; i++) {
            await users[i].updateOne({$set: {blocked: "0"}})
        }
        
        res.status(200).send("Success")
    } catch(err) {
        console.log(err);
    }
})

router.post("/getUsersAccordingToTime", async (req, res) => {
    try {

        const today = await User.find({createdAt: {$gte: new Date(Date.now()).setHours(0,0,0,0)}})
        const yesterday = await User.find({createdAt: {$lt: new Date(Date.now() - 24*60*60 * 1000), $gt: new Date(Date.now() - (2 * 24*60*60) * 1000)}})
        const thisweek = await User.find({createdAt: {$gt: new Date(Date.now() - (7 * 24*60*60) * 1000)}})
        const past15days = await User.find({createdAt: {$gt: new Date(Date.now() - (15 * 24*60*60) * 1000)}})
        const thismonth = await User.find({createdAt: {$gt: new Date(Date.now() - (30 * 24*60*60) * 1000)}})
        // const thisyear = await User.find({createdAt: {$gt: new Date(Date.now() - (365 * 24*60*60) * 1000)}})
        
        res.status(200).send([today.length, yesterday.length, thisweek.length, past15days.length, thismonth.length])

    } catch(err) {
        console.log(err);
    }
})

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

router.post("/getVisitsYearly", async (req, res) => {
    try {

        const fromYear = new Date(req.body.fromYear);
        const toYear = new Date(req.body.toYear);

        const visits = []

        var temp1 = new Date(fromYear)

        temp1.setDate(1)
        temp1.setMonth(0)

        for (var i = 0; i <= toYear.getFullYear() - fromYear.getFullYear(); i++) {
            var daysinyear = await days_of_a_year(temp1.getFullYear())
            var temp2 = new Date(temp1.getTime() + daysinyear * 24 * 60 * 60 * 1000)
            const res = await Visit.find({createdAt: {$gte: temp1, $lte: temp2}})
            visits.push(res.length)
            temp1 = new Date(temp1.getTime() + daysinyear * 24 * 60 * 60 * 1000)
        }

        // console.log(visits)
        res.status(200).json(visits)

    } catch(err) {
        res.status(500).json(err)
        // console.log(err)
    }
})

router.post("/getVisitsMonthly", async (req, res) => {
    try {

        const yearForMonth =  new Date(req.body.yearForMonth);

        var date = new Date(yearForMonth - 2 * 24 * 60 * 60 * 1000)

        date.setDate(1)
        date.setMonth(0)
  
        var visits = []

        var lastday = async (y,m) => {
            return new Date(y, m +1, 0).getDate();
        }

        for (var i = 0; i < 12; i++) {
            var temp1 = await lastday(date.getFullYear(), date.getMonth())
            var temp2 = new Date(date)
            temp2.setDate(temp1)
            const res = await Visit.find({createdAt: {$gte: date, $lte: new Date(temp2)}})
            visits.push(res.length)
            // console.log(date)
            date = new Date(date.getTime() + temp1 * 24 * 60 * 60 * 1000)
        }

        // console.log(visits)

        res.status(200).json(visits)

    } catch(err) {
        res.status(500).json(err)
    }
})

router.post("/getVisitsWeekly", async (req, res) => {
    try {

        var monthAndYearForWeek = new Date(req.body.monthAndYearForWeek)

        monthAndYearForWeek.setDate(30)

        const thisweek = await Visit.find({createdAt: {$gte: new Date(monthAndYearForWeek - 7 * 24*60*60 * 1000), $lte: monthAndYearForWeek}})
        const secondweek = await Visit.find({createdAt: {$lt: new Date(monthAndYearForWeek - 7 * 24*60*60 * 1000), $gt: new Date(monthAndYearForWeek - (14 * 24*60*60) * 1000)}})
        const thirdweek = await Visit.find({createdAt: {$lt: new Date(monthAndYearForWeek - 14 * 24*60*60 * 1000), $gt: new Date(monthAndYearForWeek - (28 * 24*60*60) * 1000)}})
        const fourthweek = await Visit.find({createdAt: {$lt: new Date(monthAndYearForWeek - 28 * 24*60*60 * 1000), $gt: new Date(monthAndYearForWeek - (31 * 24*60*60) * 1000)}})

        res.status(200).send([thisweek.length, secondweek.length, thirdweek.length, fourthweek.length])

    } catch(err) {
        res.status(500).json(err)
        console.log(err)
    }
})

router.post("/getVisitsDaily", async (req, res) => {
    try {

        var fromDate = new Date(req.body.fromDate);
        var toDate = new Date(req.body.toDate);

        var temp = fromDate

        // console.log(await Visit.find({createdAt: {$gte: fromDate, $lte: new Date(fromDate.getTime() + 24 * 60 * 60 * 1000)}}))

        var visits = []

        for (var i = 0; i <= toDate.getDate() - fromDate.getDate(); i++) {
            const res = await Visit.find({createdAt: {$gte: temp, $lt: new Date(temp.getTime() + 24 * 60 * 60 * 1000)}})
            visits.push(res.length)
            temp = new Date(temp.getTime() + 24 * 60 * 60 * 1000)
        }

        // console.log(visits)
        res.status(200).json(visits)

    } catch(err) {
        res.status(500).json(err)
        console.log(err)
    }
})

router.post("/getVisitsPast4Weeks", async (req, res) => {
    try {
        const thisweek = await Visit.find({createdAt: {$gte: new Date(Date.now() - 7 * 24*60*60 * 1000)}})
        const secondweek = await Visit.find({createdAt: {$lt: new Date(Date.now() - 7 * 24*60*60 * 1000), $gt: new Date(Date.now() - (14 * 24*60*60) * 1000)}})
        const thirdweek = await Visit.find({createdAt: {$lt: new Date(Date.now() - 14 * 24*60*60 * 1000), $gt: new Date(Date.now() - (28 * 24*60*60) * 1000)}})
        const fourthweek = await Visit.find({createdAt: {$lt: new Date(Date.now() - 28 * 24*60*60 * 1000), $gt: new Date(Date.now() - (31 * 24*60*60) * 1000)}})

        res.status(200).send([thisweek.length, secondweek.length, thirdweek.length, fourthweek.length])

    } catch(err) {
        res.status(500).json(err)
    }
})

router.post("/getVisitDetailsYearly", async (req, res) => {
    try {

        const date = new Date(req.body.year)
        date.setDate(1)
        date.setMonth(0)

        const lastDate = new Date(req.body.year)
        lastDate.setDate(31)
        lastDate.setMonth(11)
        
        const visits = await Visit.find({createdAt: {$gte: date.setHours(0, 0, 0, 0), $lte: lastDate.setHours(23, 59, 59)}})

        res.status(200).send(visits)

    } catch(err) {
        console.log(err);
    }
})

router.post("/getVisitDetailsMonthly", async (req, res) => {
    try {

        const date = new Date(req.body.monthAndYear)

        date.setDate(1)

        var lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        
        const visits = await Visit.find({createdAt: {$gte: date.setHours(0, 0, 0, 0), $lte: lastDayOfMonth.setHours(23, 59, 59)}})

        res.status(200).send(visits)

    } catch(err) {
        console.log(err);
    }
})


router.post("/getVisitDetailsFromTo", async (req, res) => {
    try {

        const fromDate = new Date(req.body.fromDate)
        const toDate = new Date(req.body.toDate)
        
        const visits = await Visit.find({createdAt: {$gte: fromDate.setHours(0, 0, 0, 0), $lte: toDate.setHours(23, 59, 59)}})

        res.status(200).send(visits)

    } catch(err) {
        console.log(err);
    }
})

router.post("/getVisitDetailsDaily", async (req, res) => {
    try {

        const date = new Date(req.body.date)

        // console.log(date);
        
        const visits = await Visit.find({createdAt: {$gte: date.setHours(0, 0, 0, 0), $lte: date.setHours(23, 59, 59)}})

        res.status(200).send(visits)

    } catch(err) {
        console.log(err);
    }
})

router.post("/getVisitDetailsToday", async (req, res) => {
    try {

        // const date = new Date(Date.now())

        // console.log(date);
        
        const today = await Visit.find({createdAt: {$gte: new Date(Date.now()).setHours(0,0,0,0)}})

        res.status(200).send(today)

    } catch(err) {
        console.log(err);
    }
})

router.post("/getRegisteredUsersDetailsYearly", async (req, res) => {
    try {

        const date = new Date(req.body.year)
        date.setDate(1)
        date.setMonth(0)

        const lastDate = new Date(req.body.year)
        lastDate.setDate(31)
        lastDate.setMonth(11)
        
        const users = await User.find({createdAt: {$gte: date.setHours(0, 0, 0, 0), $lte: lastDate.setHours(23, 59, 59)}})

        res.status(200).send(users)

    } catch(err) {
        console.log(err);
    }
})

router.post("/getRegisteredUsersDetailsMonthly", async (req, res) => {
    try {

        const date = new Date(req.body.monthAndYear)

        date.setDate(1)

        var lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        
        const users = await User.find({createdAt: {$gte: date.setHours(0, 0, 0, 0), $lte: lastDayOfMonth.setHours(23, 59, 59)}})

        res.status(200).send(users)

    } catch(err) {
        console.log(err);
    }
})


router.post("/getRegisteredUsersDetailsFromTo", async (req, res) => {
    try {

        const fromDate = new Date(req.body.fromDate)
        const toDate = new Date(req.body.toDate)
        
        const users = await User.find({createdAt: {$gte: fromDate.setHours(0, 0, 0, 0), $lte: toDate.setHours(23, 59, 59)}})

        res.status(200).send(users)

    } catch(err) {
        console.log(err);
    }
})

router.post("/getRegisteredUsersDetailsDaily", async (req, res) => {
    try {

        const date = new Date(req.body.date)

        // console.log(date);
        
        const users = await User.find({createdAt: {$gte: date.setHours(0, 0, 0, 0), $lte: date.setHours(23, 59, 59)}})

        res.status(200).send(users)

    } catch(err) {
        console.log(err);
    }
})

router.post("/getRegisteredUsersYearly", async (req, res) => {
    try {

        const fromYear = new Date(req.body.fromYear);
        const toYear = new Date(req.body.toYear);

        const users = []

        var temp1 = new Date(fromYear)

        temp1.setDate(1)
        temp1.setMonth(0)

        for (var i = 0; i <= toYear.getFullYear() - fromYear.getFullYear(); i++) {
            var daysinyear = await days_of_a_year(temp1.getFullYear())
            var temp2 = new Date(temp1.getTime() + daysinyear * 24 * 60 * 60 * 1000)
            const res = await User.find({createdAt: {$gte: temp1, $lte: temp2}})
            users.push(res.length)
            temp1 = new Date(temp1.getTime() + daysinyear * 24 * 60 * 60 * 1000)
        }

        // console.log(visits)
        res.status(200).json(users)

    } catch(err) {
        res.status(500).json(err)
        // console.log(err)
    }
})

router.post("/getRegisteredUsersMonthly", async (req, res) => {
    try {

        const yearForMonth =  new Date(req.body.yearForMonth);

        var date = new Date(yearForMonth - 2 * 24 * 60 * 60 * 1000)

        date.setDate(1)
        date.setMonth(0)
  
        var users = []

        var lastday = async (y,m) => {
            return new Date(y, m +1, 0).getDate();
        }

        for (var i = 0; i < 12; i++) {
            var temp1 = await lastday(date.getFullYear(), date.getMonth())
            var temp2 = new Date(date)
            temp2.setDate(temp1)
            temp2.setHours(23, 59, 59)
            const res = await User.find({createdAt: {$gte: date, $lte: new Date(temp2)}})
            users.push(res.length)
            // console.log(date)
            date = new Date(date.getTime() + temp1 * 24 * 60 * 60 * 1000)
        }

        // console.log(visits)

        res.status(200).json(users)

    } catch(err) {
        res.status(500).json(err)
    }
})

router.post("/getRegisteredUsersWeekly", async (req, res) => {
    try {

        var monthAndYearForWeek = new Date(req.body.monthAndYearForWeek)

        var lastDayOfMonth = new Date(monthAndYearForWeek.getFullYear(), monthAndYearForWeek.getMonth() + 1, 0);

        monthAndYearForWeek.setDate(lastDayOfMonth.getDate())

        const thisweek = await User.find({createdAt: {$gte: new Date(monthAndYearForWeek - 7 * 24*60*60 * 1000), $lte: monthAndYearForWeek.setHours(23, 59, 59)}})
        const secondweek = await User.find({createdAt: {$lt: new Date(monthAndYearForWeek - 7 * 24*60*60 * 1000), $gt: new Date(monthAndYearForWeek - (14 * 24*60*60) * 1000)}})
        const thirdweek = await User.find({createdAt: {$lt: new Date(monthAndYearForWeek - 14 * 24*60*60 * 1000), $gt: new Date(monthAndYearForWeek - (28 * 24*60*60) * 1000)}})
        const fourthweek = await User.find({createdAt: {$lt: new Date(monthAndYearForWeek - 28 * 24*60*60 * 1000), $gt: new Date(monthAndYearForWeek - (31 * 24*60*60) * 1000)}})

        res.status(200).send([thisweek.length, secondweek.length, thirdweek.length, fourthweek.length])

    } catch(err) {
        res.status(500).json(err)
        console.log(err)
    }
})

router.post("/getRegisteredUsersDaily", async (req, res) => {
    try {

        var fromDate = new Date(req.body.fromDate);
        var toDate = new Date(req.body.toDate);

        var temp = fromDate

        // console.log(await Visit.find({createdAt: {$gte: fromDate, $lte: new Date(fromDate.getTime() + 24 * 60 * 60 * 1000)}}))

        var users = []

        for (var i = 0; i <= toDate.getDate() - fromDate.getDate(); i++) {
            const res = await User.find({createdAt: {$gte: temp, $lt: new Date(temp.getTime() + 24 * 60 * 60 * 1000)}})
            users.push(res.length)
            temp = new Date(temp.getTime() + 24 * 60 * 60 * 1000)
        }

        // console.log(visits)
        res.status(200).json(users)

    } catch(err) {
        res.status(500).json(err)
        console.log(err)
    }
})

router.post("/getRegisteredUsers", async (req, res) => {
    try {
        
        const users = await User.find();
        
        res.status(200).json(users)

    } catch(err) {
        res.status(500).json(err)
    }
})

router.post("/getRegisteredUsersCount", async (req, res) => {
    try {
        
        const usersCount = await User.countDocuments();
        
        res.status(200).json(usersCount)

    } catch(err) {
        res.status(500).json(err)
    }
})

router.post("/getUser", async (req, res) => {
    try {
        const user = await User.findById(req.body.userId)
        // console.log(user);
        if (!user) {
            res.status(404).json("User not found")
            return
        }

        res.status(200).json({_id: user._id, username: user.username, email: user.email, phone: user.phone, likedGames: user.likedGames, history: user.history, profileLikes: user.profileLikes, blocked: user.blocked})
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

        res.status(200).json({_id: user._id, username: user.username, email: user.email, phone: user.phone, likedGames: user.likedGames, history: user.history, profileLikes: user.profileLikes, accessToken: user.accessToken, refreshToken: user.refreshToken})

    } catch(err) {
        console.log(err);
        res.json(err);
    }
});

router.post("/addReview", async function(req, res) {

    try {
        const user = await User.findById(req.body._id);

        // console.log(req.body._id);
        // console.log(req.body.username);

        if (!user) {
            res.status(404).json("User not found")
        }

        await user.updateOne({$push: {reviews: req.body.review}});

        await user.save()

        user.reviews.push(req.body.review)

        res.status(200).json({_id: user._id, username: user.username, email: user.email, phone: user.phone, likedGames: user.likedGames, history: user.history, profileLikes: user.profileLikes, accessToken: user.accessToken, refreshToken: user.refreshToken})

    } catch(err) {
        console.log(err);
        res.json(err);
    }
});

router.post("/history", async (req, res) => {
    try {
        const user = await User.findById(req.body.userId)

        const historyGame = {
            gameId: req.body.gameId, 
            name: req.body.name,
            iframeLink: req.body.iframeLink
        }

        await user.updateOne({$push: {history: historyGame}})

        await user.save()
        
        const updatedUser = await User.findById(req.body.userId)

        res.status(200).json({_id: updatedUser._id, username: updatedUser.username, email: updatedUser.email, phone: updatedUser.phone, likedGames: updatedUser.likedGames, history: updatedUser.history, profileLikes: updatedUser.profileLikes, accessToken: updatedUser.accessToken, refreshToken: updatedUser.refreshToken})

    } catch(err) {
        console.log(err);
        res.status(500).json(err)
    }
})

router.post("/likeProfile", async (req, res) => {
    try {
        const user = await User.findById(req.body.userId)

        if (user.profileLikes.includes(req.body.likeId)) {
            await user.updateOne({$pull: {profileLikes: req.body.likeId}})
            await user.save()

            const updatedUser = await User.findById(req.body.userId)
            res.status(200).json({_id: updatedUser._id, username: updatedUser.username, email: updatedUser.email, phone: updatedUser.phone, likedGames: updatedUser.likedGames, history: updatedUser.history, profileLikes: updatedUser.profileLikes, accessToken: updatedUser.accessToken, refreshToken: updatedUser.refreshToken})

            return;
        }   

        await user.updateOne({$push: {profileLikes: req.body.likeId}})

        await user.save()
        
        const updatedUser = await User.findById(req.body.userId)

        res.status(200).json({_id: updatedUser._id, username: updatedUser.username, email: updatedUser.email, phone: updatedUser.phone, likedGames: updatedUser.likedGames, history: updatedUser.history, profileLikes: updatedUser.profileLikes, accessToken: updatedUser.accessToken, refreshToken: updatedUser.refreshToken})

    } catch(err) {
        console.log(err);
    }
})

module.exports = router;