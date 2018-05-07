const Agenda = require('agenda');
const db = require('./db')
const agenda = new Agenda({
    db: {
        address: db
    },
    processEvery: "1 minute"
});

module.exports = agenda;