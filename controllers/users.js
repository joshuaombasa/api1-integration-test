const User = require('../models/user')

const usersRouter = require('express').Router()


usersRouter.get('/', async (request, response, next) => {
  try {
    const users = await User.find({})
    response.json(users)
  } catch (error) {
    next(error)
  }
})

usersRouter.get('/:id', async (request, response, next) => {
  try {
    const user = await User.findById(request.params.id)

    if (!user) {
      return response.status(404).end()
    }
    response.json(user)
  } catch (error) {
    next(error)
  }
})

usersRouter.post('/', async (request, response, next) => {
  const { name, email, password } = request.body

  const userObject = new User({ name, email, password })
  try {
    const savedUser = await userObject.save()
    respose.status(201).json({ savedUser })
  } catch (error) {
    next(error)
  }
})

usersRouter.put('/:id', async (request, response, next) => {
  const { name, email, password } = request.body


  try {
    const updatedUser = await User.findByIdAndUpdate(
      request.params.id,
      { name, email, password },
      { new: true }
    )
    respose.status(201).json({ updatedUser })
  } catch (error) {
    next(error)
  }
})

usersRouter.delete('/:id', async (request, response, next) => {
  try {
    await User.findByIdAndDelete(request.params.id)
  } catch (error) {
    next(error)
  }
})

module.exports = usersRouter