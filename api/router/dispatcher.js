const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const IP = require('ip')
const router = require('express').Router()
const Dispatcher = require('../models/dispatcher')
const Middlewares = require('../../helpers/middlewares')
const agenda = require('../../helpers/agenda')

router.get("/v1/count/all", async (req, res) => {
    try {
        const count = await Dispatcher.count()
        res.json({
            count: count
        })
    } catch (error) {
        res.status(500).json({
            status: error.message
        })
    }
})

router.get("/v1/count/awake", async (req, res) => {
    try {
        const count = await Dispatcher.awake()
        res.json({
            count: count
        })
    } catch (error) {
        res.status(500).json({
            status: error.message
        })
    }
})

router.get("/v1/count/asleep", async (req, res) => {
    try {
        const count = await Dispatcher.asleep()
        res.json({
            count: count
        })
    } catch (error) {
        res.status(500).json({
            status: error.message
        })
    }
})

router.get("/v1/dispatchers", Middlewares.limitGetDispatchers, async (req, res) => {
    try {
        let temp = []
        const dispatchers = await Dispatcher.dispatchers()
        dispatchers.forEach(dispatcher => {
            temp.push(dispatcher.addr)
        })
        res.json(temp)
    } catch (error) {
        res.status(500).json({
            status: error.message
        })
    }
})

router.post("/v1/dispatcher", Middlewares.agent, Middlewares.limitCreateDispatcher, async (req, res) => {
    try {
        const {pub, port, ip} = req.body;
        if(pub && port && ip){
            if (IP.isPrivate(ip)) {
                return res.status(400).json({status: "Public IP required"})
            }
            token = await Dispatcher.create({pub, ip, port})
            agenda.now("verify", {pub})
            return res.json({token})
        }
        return res.status(400).json({ status: "Incomplete Request" });
    } catch (error) {
        res.status(500).json({
            status: error.message
        })
    }
})

router.patch("/v1/dispatcher/connect", Middlewares.auth, async (req, res) => {
    try {
        await Dispatcher.incrWorkers(req.dispatcher)
        res.json({
            status: "success"
        })
    } catch (error) {
        res.status(500).json({
            status: error.message
        })
    }
})

router.patch("/v1/dispatcher/disconnect", Middlewares.auth, async (req, res) => {
    try {
        await Dispatcher.decrWorkers(req.dispatcher)
        res.json({
            status: "success"
        })
    } catch (error) {
        res.status(500).json({
            status: error.message
        })
    }
})

router.patch("/v1/dispatcher/wake", Middlewares.auth, async (req, res) => {
    try {
        const {ip, port} = req.body
        await Dispatcher.wake(req.dispatcher, ip, port)
        res.json({
            status: "success"
        })
    } catch (error) {
        res.status(500).json({
            status: error.message
        })
    }
})

router.patch("/v1/dispatcher/sleep", Middlewares.auth, async (req, res) => {
    try {
        await Dispatcher.sleep(req.dispatcher)
        res.json({
            status: "success"
        })
    } catch (error) {
        res.status(500).json({
            status: error.message
        })
    }
})

module.exports = router