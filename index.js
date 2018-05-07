require('dotenv').config();
const {NODE_ENV, PORT, DB, DB_DEV} = process.env;
const app = require('express')();
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const agenda = require('./helpers/agenda');
const tasks = require('./helpers/tasks')
const port = PORT || 5000;
const db = require('./helpers/db')
const mongoose = require("mongoose").connect(db, {
    promiseLibrary: require("bluebird")
});

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(helmet());
app.use(cors());

if (NODE_ENV === "dev"){
    app.use(require("morgan")("short"));
}

app.use(require("./api/router/dispatcher"));

app.get("/v1", (req, res) => {
    res.send({
        status: "running"
    });
})

tasks()

agenda.on("ready", () => {
    agenda.start();
    app.listen(port, () => {
        if (NODE_ENV === "dev"){
            console.log(`Server running on port ${port}`);
        }
    })
})
