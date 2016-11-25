// libs
const express = require('express')
const routes = require('./routes')
const bodyParser = require('body-parser')
const configuration = require('./config/config')
const bluebird = require('bluebird')
const mongoose = require('mongoose')

const app = express()

// express configuration

app.use(bodyParser.json())

// mongoose configuration
mongoose.Promise = bluebird
mongoose.connect(configuration.mongodb_connection)

// routes
routes.setRoutes(app)


module.exports = app
