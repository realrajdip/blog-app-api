const asyncHandler = require('express-async-handler')
const { findOne } = require('../models/userModel')
const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const registerUser = asyncHandler(async(req, res) => {
    //Getting details from the request body
    const {name, email, password} = req.body

    //Validating details
    if(!name || !email || !password){
        res.status(400)
        throw new Error ('Please fill all required fields')
    }

    //Check if user exists
    const userExists = await User.findOne({email})

    if(userExists){
        res.status(400)
        throw new Error ('User already exists')
    }

    //Hashing password
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(password, salt)

    //Create new user
    const user = await User.create({
        name,
        email,
        password: hashedPassword
    })

    //Return some data if user creation is successful
    if(user){
        res.status(201).json({
            _id:user.id,
            name:user.name,
            email:user.email,
            token:generateToken(user._id)
        })
    }else{
        res.status(400)
        throw new Error ('Invalid user data')
    }

})


const loginUser = asyncHandler(async(req, res) => {
    //Getting details from request body
    const {email, password} = req.body

    //Get specific user from collection
    const user  = await User.findOne({email})

    //Check if user exists and compare inputted password to hashed password
    if(user && await bcrypt.compare(password, user.password)){
        res.status(201).json({
            _id:user.id,
            name:user.name,
            email:user.email,
            token:generateToken(user._id)
        })
    }else{
        res.status(400)
        throw new Error ('Invalid credentials')
    }
})


const getThisUser = asyncHandler(async(req, res) => {
    const {_id, name, email} = await User.findById(req.user.id)

    res.status(200).json({
        id:_id,
        name,
        email
    })
})


const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn:'30d'
    })
}

module.exports = {
    registerUser,
    loginUser,
    getThisUser
}