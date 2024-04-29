const mongoose = require('mongoose')
const Tool = require('../models/tool')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./tests-helper')

const api = supertest(app)

beforeEach(async () => {
  await Tool.deleteMany({})

  for (let tool of helper.toolsList) {
    const toolObject = new Tool(tool)
    await toolObject.save()
  }
})

describe('when there are initially some tools', () => {
  test('tools are returned as json', async () => {
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

  test('a specific tool is among the returned tools', async () => {
    const response = await api.get('/api/tools')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const names = response.body.map(t => t.name)
    expect(names).toContain(helper.toolsList[0].name)
  })
})

describe('fetching a single too', () => {
  test('succeeds when given a valid id', async () => {
    const toolsAtStart = await helper.toolsInDb()
    const response = await api.get(`/api/tools/${toolsAtStart[0].id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('fails with statuscode 400 when given an invalid id', async () => {
    const invalidId = 'nfeidjw'
    const response = await api.get(`/api/tools/${invalidId}`)
      .expect(400)
  })

  test('fails with statuscode 400 when given a nonexistent id', async () => {
    const nonexistentId = await helper.nonexistentId()
    const response = await api.get(`/api/tools/${nonexistentId}`)
      .expect(404)
  })
})

describe('addition of a new tool', () => {
  test('succeeds when given valid data', async () => {
    const toolsAtStart = await helper.toolsInDb()
    const response = await api.post(`/api/tools/`)
      .send(helper.validData)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const toolsAtEnd = await helper.toolsInDb()
    const names = toolsAtEnd.map(t => t.name)
    expect(names).toContain(helper.validData.name)
    expect(toolsAtEnd).toHaveLength(toolsAtStart.length + 1)
  })

  test('fails with statuscode 400 when given invalid data', async () => {
    const toolsAtStart = await helper.toolsInDb()
    const response = await api.post(`/api/tools/`)
      .send(helper.invalidData)
      .expect(400)
    const toolsAtEnd = await helper.toolsInDb()
    const names = toolsAtEnd.map(t => t.name)
    expect(names).not.toContain(helper.validData.name)
    expect(toolsAtEnd).toHaveLength(toolsAtStart.length)
  })
})

describe('deleting of a tool', () => {
  test('succeeds with statuscode 204',async() => {
    const toolsAtStart = await helper.toolsInDb()
    const response = await api.delete(`/api/tools/${toolsAtStart[0].id}`)
      .send(helper.invalidData)
      .expect(204)
    const toolsAtEnd = await helper.toolsInDb()
    const names = toolsAtEnd.map(t => t.name)
    expect(names).not.toContain(toolsAtStart[0].name)
    expect(toolsAtEnd).toHaveLength(toolsAtStart.length - 1)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})