require('dotenv').config()
const axios = require('axios')
const Dispatchers = require('../api/models/dispatcher')
const agenda = require('./agenda')

module.exports = () => {
    agenda.define(
      "verify",
      {
        priority: "high",
        concurrency: 100
      },
      async (job, done) => {
        try {
          const { pub } = job.attrs.data;
          const dispatcher = await Dispatchers.dispatcher(pub);
          const url = `http://${dispatcher.ip}:${dispatcher.port}/status`
          const res = await axios.get(url)
          if (dispatcher.pub !== res.data.pub) {
            await Dispatchers.remove(dispatcher.pub)
          } else if (!dispatcher.active){
            await Dispatchers.wake(pub)
          }
          job.remove();
          done();
        } catch (error) {
          const { pub } = job.attrs.data;
          await Dispatchers.remove(pub)
          job.remove()
        }
      }
    );
  };