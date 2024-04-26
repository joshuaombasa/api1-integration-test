const mongoose = require('mongoose')

const toolSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: String, required: true },
  size: { type: String, required: true },
  price: { type: Number, required: true },
  isAvailable: { type: Boolean, default: false },
})

toolSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject.id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Tool', toolSchema)