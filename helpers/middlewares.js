const RateLimit = require('express-rate-limit')
const jwt = require('jsonwebtoken')

const Middlewares = {
    agent(req, res, next){
        try {
            // if(req.headers["user-agent"] !== "Gizo Node"){
            //     return res.status(400).send({
            //         status: "Only gizo nodes allowed"
            //     })
            // }
            return next()
        } catch (error) {
            res.status(500).send({
                status: error.message
            })
        }
    },
    auth(req, res, next){
        try {
            const token = req.headers['x-gizo-token']
            if(!token){
                return res.status(401).send({
                    status: "No token passed"
                  })
            }
            const {pub} = jwt.decode(token)
            req.dispatcher = pub
            return next()
        } catch (error) {
            console.log(error.message)
            res.status(500).send({
                status: error.message
            })
        }
    },
    limitCreateDispatcher: new RateLimit({
        windowMs: 12*60*60*1000, //? 12 hours period
        delayMs: 0, //? no delay
        skipFailedRequests: true,
        max: 2, //? 2 requests allowed per 12 hours period
    }),
    limitGetDispatchers: new RateLimit({
        windowMs: 10*60*100, //? 10 mins period
        delayMs: 0, //? no delay
        skipFailedRequests: true,
        max: 5 //? 5 requests allowed per 10 mins period
    })
}

module.exports = Middlewares