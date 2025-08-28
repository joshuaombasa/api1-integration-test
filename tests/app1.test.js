const mongoose = require('mongoose')
const supertest = require('supertest')
const Tool = require('../models/tool')
const app = require('../app')
const helper = require('./tests-helper')

const api = supertest(app)

beforeEach(async () => {
  await Tool.deleteMany({})

  for (const tool of helper.toolsList) {
    await new Tool(tool).save()
  }
})

describe('when some tools already exist in the database', () => {
  test('tools are returned as JSON', async () => {
    await api.get('/api/tools')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all tools are returned', async () => {
    const response = await api.get('/api/tools')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toHaveLength(helper.toolsList.length)
  })

  test('a specific tool is included in the results', async () => {
    const response = await api.get('/api/tools')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const names = response.body.map(tool => tool.name)
    expect(names).toContain(helper.toolsList[0].name)
  })
})

describe('fetching a single tool', () => {
  test('succeeds with a valid id', async () => {
    const toolsAtStart = await helper.toolsInDb()
    await api.get(`/api/tools/${toolsAtStart[0].id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('fails with 400 when id is invalid', async () => {
    await api.get('/api/tools/invalid-id')
      .expect(400)
  })

  test('fails with 404 when tool does not exist', async () => {
    const nonexistentId = await helper.nonexistentId()
    await api.get(`/api/tools/${nonexistentId}`)
      .expect(404)
  })
})

describe('adding a new tool', () => {
  test('succeeds with valid data', async () => {
    const toolsAtStart = await helper.toolsInDb()

    await api.post('/api/tools/')
      .send(helper.validData)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const toolsAtEnd = await helper.toolsInDb()
    const names = toolsAtEnd.map(tool => tool.name)

    expect(names).toContain(helper.validData.name)
    expect(toolsAtEnd).toHaveLength(toolsAtStart.length + 1)
  })

  test('fails with 400 when data is invalid', async () => {
    const toolsAtStart = await helper.toolsInDb()

    await api.post('/api/tools/')
      .send(helper.invalidData)
      .expect(400)

    const toolsAtEnd = await helper.toolsInDb()
    const names = toolsAtEnd.map(tool => tool.name)

    expect(names).not.toContain(helper.validData.name)
    expect(toolsAtEnd).toHaveLength(toolsAtStart.length)
  })
})

describe('deleting a tool', () => {
  test('succeeds with status code 204', async () => {
    const toolsAtStart = await helper.toolsInDb()

    await api.delete(`/api/tools/${toolsAtStart[0].id}`)
      .expect(204)

    const toolsAtEnd = await helper.toolsInDb()
    const names = toolsAtEnd.map(tool => tool.name)

    expect(names).not.toContain(toolsAtStart[0].name)
    expect(toolsAtEnd).toHaveLength(toolsAtStart.length - 1)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
