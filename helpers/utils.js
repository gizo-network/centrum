require("dotenv").config()
const {JWT_SECRET} = process.env
const jwt = require('jsonwebtoken')
const Utils = {
    generateToken(pub){
        return jwt.sign({pub}, JWT_SECRET, {
            algorithm: "HS256"
        })
    }
}

module.exports = Utils