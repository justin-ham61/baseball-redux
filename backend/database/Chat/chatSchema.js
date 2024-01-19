const mongoose = require('mongoose')

const chatMessageSchema = new mongoose.Schema({
  userId: String,
  roomId: String,
  message: String,
  timestamp: Date
})

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema)

module.exports = ChatMessage