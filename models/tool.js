const mongoose = require('mongoose')

const toolSchema = new mongoose.Schema({
  name: { type: String, required: true },
  size: { type: String, required: true },
  price: { type: Number, required: true },
  isAvailable: { type: Boolean, default: false },
})

toolSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
  }
})

module.exports = mongoose.model('Tool', toolSchema)
