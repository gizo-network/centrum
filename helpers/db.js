require('dotenv').config()
const {NODE_ENV, DB, DB_DEV} = process.env
module.exports = NODE_ENV == "dev" ? DB_DEV : DB;