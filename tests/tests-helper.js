const Tool = require('../models/tool')

const sampleTools = [
  {
    name: 'Multimeter1',
    price: 100,
    size: 'small',
    description: 'Description for object 1',
    isAvailable: true,
  },
  {
    name: 'Multimeter2',
    price: 200,
    size: 'medium',
    description: 'Description for object 2',
    isAvailable: true,
  },
  {
    name: 'Multimeter3',
    price: 300,
    size: 'large',
    description: 'Description for object 3',
    isAvailable: true,
  },
  {
    name: 'Multimeter4',
    price: 400,
    size: 'extra-large',
    description: 'Description for object 4',
    isAvailable: true,
  },
]

const getToolsFromDb = async () => {
  const tools = await Tool.find({})
  return tools.map(tool => tool.toJSON())
}

const generateNonexistentId = async () => {
  const tempTool = new Tool({
    name: 'Multimeter5',
    price: 500,
    size: 'extra-large',
    description: 'Description for object 5',
    isAvailable: true,
  })

  const savedTool = await tempTool.save()
  await Tool.findByIdAndDelete(savedTool.id)

  return savedTool.id
}

const validToolData = {
  name: 'Multimeter6',
  price: 600,
  size: 'extra-large',
  description: 'Description for object 6',
  isAvailable: true,
}

const invalidToolData = {
  name: 'Multimeter7',
  isAvailable: true,
}

module.exports = {
  sampleTools,
  getToolsFromDb,
  generateNonexistentId,
  validToolData,
  invalidToolData,
}
