const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const jwt = require('jsonwebtoken')
const {BadRequestError, UnauthenticatedError} = require('../errors')
//never store user passwords as strings
const register = async (req, res) => {
    //schema.pre('save') runs before any save

    //User.create() calls save internally

    //user.save() triggers the same middleware
    //we are hashing the password using mongoose middleware
    const user = await User.create({...req.body})
    const token = user.createJWT()
    res.status(StatusCodes.CREATED).json({user: {name: user.name }, token })
}
const login = async (req, res) => {
    const {email, password} = req.body
    if (!email || !password){
        throw new BadRequestError('Please provide email and password')
    }
    const user = await User.findOne({email})
    //if the user exists we can send back the username as well as the token 
    //if the user doesn't exist we can throw an unauthenticated error
    // comapre password
    if (!user){
        throw new UnauthenticatedError('Invalid Credentials')
    }
    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect){
        throw new UnauthenticatedError('Invalid Password')
    }
    const token = user.createJWT()
    res.status(StatusCodes.OK).json({ user : { name: user.name }, token})
}
module.exports = {
    register, login
}
