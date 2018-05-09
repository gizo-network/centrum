const mongoose = require('mongoose')
const {generateToken} = require("../../helpers/utils")

const dispatcherSchema = mongoose.Schema({
    pub: {
        type: String,
        required: true,
        unique: true
    },
    ip: {
        type: String,
        required: true
    },
    port: {
        type: Number,
        required: true
    }, 
    addr: {
        type: String,
        required: true
    },
    workers: {
        type: Number,
        required: true,
        default: 0
    }, 
    active: {
        type: Boolean,
        required: true,
        default: false,
    },
    token: {
        type: String,
        required: true,
        unique: true
    }
})

const DispatcherModel = mongoose.model("dispatcher", dispatcherSchema)

const Dispatcher = {
    async create(payload){
        const {pub, ip, port} = payload
        if(pub && ip && port){
            const addr = `gizo://${pub}@${ip}:${port}`
            const token = generateToken(pub)
            await DispatcherModel({pub, ip, port, addr, token}).save()
            return token
        } else {
            throw new Error("Incomplete Parameters");
        }
    },
    async dispatcher(pub){
        const dispatcher = await DispatcherModel.findOne({pub})
        return dispatcher
    },
    async dispatchers(){
        const dispatchers = await DispatcherModel.find({active: true}, {addr: 1, workers: 1}).sort({workers: 1}).limit(10)
        return dispatchers
    },
    async incrWorkers(pub){
        await DispatcherModel.findOneAndUpdate({pub}, {$inc: {workers: 1}})
    },
    async decrWorkers(pub){
        await DispatcherModel.findOneAndUpdate({pub}, {$inc: {workers: -1}})
    },
    async sleep(pub){
        await DispatcherModel.findOneAndUpdate({pub}, {active: false})
    },
    async wake(pub){
        await DispatcherModel.findOneAndUpdate({pub}, {active: true})
    },
    async remove(pub) {
        await DispatcherModel.findOneAndRemove({pub})
    },
    async count(){
        count = DispatcherModel.count()
        return count
    },
    async awake(){
        count = DispatcherModel.count({active: true})
        return count
    },
    async asleep(){
        count = DispatcherModel.count({active: false})
        return count
    }
}

module.exports = Dispatcher