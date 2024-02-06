const mongoose = require('mongoose')

const chatroomSchema = new mongoose.Schema({
  roomId: String,
  roomDate: Date,
  teams: String,
  gamePk: String
})

const Chatroom = mongoose.model('Chatroom', chatroomSchema)

module.exports = Chatroom