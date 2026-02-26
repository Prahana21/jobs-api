const User = require('../models/User')
const jwt = require('jsonwebtoken')
const {UnauthenticatedError} = require('../errors')

const auth = async (req, res, next) => {
    //check header
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer')){
        throw new UnauthenticatedError('Authentication failed')
    }
    const token = authHeader.split(' ')[1] // we are splitting it on the empty space, converting it to an array and we are looking for the second value
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        //attach the user
        req.user = {userId: payload.userId, name: payload.name}
        next()
    } catch (error) {
        throw new UnauthenticatedError('Authentication Invalid')
    }

}
module.exports = auth
