const mongoose = require('mongoose')

const savedchatSchema = new mongoose.Schema({
  roomId: String,
  userId: String
})

const SavedRoom = mongoose.model('SavedRoom', savedchatSchema)

module.exports = SavedRoom