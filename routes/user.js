const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const router = express.Router()
const User = require('../models/user')
const salt = 10
const auth = require('../middleware/auth')

router.post('/signup', async (req,res) => {
    const username = req.body.username
    const plainpassword = req.body.password
    const password = await bcrypt.hash(plainpassword,salt)
    const user = new User({
        username:username,
        password:password
    })
    try{
        const newuser = await user.save()
        res.status(201).json(newuser)
    }catch (err){
        res.status(500).json({message: err.message})
    }

})


router.post('/login', async (req,res) => {
    try{
        const { username, password } = req.body
        if (!username || !password){
            res.status(400).json({message: "not all fields are entered"})
        }
        const user = await User.findOne({username:username})
        if (!user){
            res.status(400).json({message:"wrong credentials"})
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch){
            res.status(400).json({message: "wrong credentials"})
        }
        const token = jwt.sign({id: user._id}, process.env.jwt)
        res.status(200).json({token:token, user:user})
    }catch (err){
        res.status(500).json({message:err.message})
    }
})

router.delete("/delete", auth, async (req, res) => {
    try {
      const deletedUser = await User.findByIdAndDelete(req.user)
      res.status(200).json(deletedUser)
    } catch (error) {
      res.status(500).json({ err: error.message })
    }
  })

module.exports = router