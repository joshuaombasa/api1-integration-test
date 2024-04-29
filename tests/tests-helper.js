const Tool = require('../models/tool')

const toolsList = [

  {
    name: 'Multimeter1',
    price: 100,
    size: 'small',
    description: 'This describes the object1',
    isAvailable: true
  },
  {
    name: 'Multimeter2',
    price: 200,
    size: 'medium',
    description: 'This describes the object2',
    isAvailable: true
  },
  {
    name: 'Multimeter3',
    price: 300,
    size: 'Large',
    description: 'This describes the object3',
    isAvailable: true
  },
  {
    name: 'Multimeter4',
    price: 400,
    size: 'extra-large',
    description: 'This describes the object4',
    isAvailable: true
  },
]

const toolsInDb = async () => {
  const tools = await Tool.find({})
  const formattedTools = tools.map(tool => tool.toJSON())
  return formattedTools
}

const nonexistentId = async () => {
  const toolObject = new Tool({
    name: 'Multimeter5',
    price: 500,
    size: 'extra-large',
    description: 'This describes the object5',
    isAvailable: true
  })

  const savedTool = await toolObject.save()
  await Tool.findByIdAndDelete(savedTool.id)
  return savedTool.id
}

const validData = {
  name: 'Multimeter6',
  price: 600,
  size: 'extra-large',
  description: 'This describes the object6',
  isAvailable: true
}

const invalidData = {
  name: 'Multimeter7',
  isAvailable: true
}
module.exports = { toolsList, toolsInDb, nonexistentId, validData, invalidData }