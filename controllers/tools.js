const Tool = require('../models/tool')
const toolsRouter = require('express').Router()

toolsRouter.get('/tools', async (request, response, next) => {
  try {
    const tools = await Tool.find({})
    response.send(tools)
  } catch (error) {
    next(error)
  }
})

toolsRouter.get('/tools/:id', async (request, response, next) => {
  try {
    const tool = await Tool.findById(request.params.id)

    if (!tool) {
      return response.sendStatus(404)
    }
    response.send(tool)
  } catch (error) {
    next(error)
  }
})

toolsRouter.post('/tools', async (request, response, next) => {
  const { name, price, size, description, isAvailable } = request.body
  try {
    const toolObject = new Tool({ name, price, size, description, isAvailable })
    const savedTool = await toolObject.save()
    response.status(201).send(savedTool)
  } catch (error) {
    next(error)
  }
})

toolsRouter.delete('/tools/:id', async (request, response, next) => {
  try {
    await Tool.findByIdAndDelete(request.params.id)
    response.sendStatus(204)
  } catch (error) {
    next(error)
  }
})

// toolsRouter.get('/tools', async (request, response, next) => {
//   try {
//     const tools = await Tool.find({})
//     response.send(tools)
//   } catch (error) {
//     next(error)
//   }
// })

module.exports = toolsRouter