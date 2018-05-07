require('dotenv').config();
const {NODE_ENV, PORT, DB, DB_DEV} = process.env;
const app = require('express')();
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const db = NODE_ENV == "dev" ? DB_DEV : DB;
const mongoose = require("mongoose").connect(db, {
    promiseLibrary: require("bluebird")
  });
const port = PORT || 5000;


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(helmet());
app.use(cors());

if (NODE_ENV === "dev"){
    app.use(require("morgan")("short"));
}

app.use(require("./api/router/dispatcher"))

app.get("/v1", (req, res) => {
    res.send({
        status: "running"
    })
})

app.listen(port, () => {
    if (NODE_ENV === "dev"){
        console.log(`Server running on port ${port}`)
    }
})
