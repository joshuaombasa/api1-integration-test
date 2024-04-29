const logger = require('./logger')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Body:', request.body)
  logger.info('Path:', request.path)
  logger.info('___')
  next()
}

const unknownEndpointHandler = (request, response, next) => {
  return response.status(404).json({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.name)

  if (error.name === 'CastError') {
    return response.status(400).json({ error: 'malformatted id' })
  }

  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: 'unknown endpoint' })
  }

  next(error)
}

module.exports = { requestLogger, errorHandler, unknownEndpointHandler }