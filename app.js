const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')

const usersRouter = require('./controllers/users')
const toolsRouter = require('./controllers/tools')

mongoose.connect(config.MONGO_URI)
   .then(() => logger.info(`Connected to MongoDB`))
   .catch(error => logger.error(error.message))

const app = express()

app.use(cors())
app.use(express.json())

app.use(middleware.requestLogger)

app.use('/api/users', usersRouter)
app.use('/api/tools', toolsRouter)

app.use(middleware.unknownEndpointHandler)
app.use(middleware.errorHandler)


module.exports = app