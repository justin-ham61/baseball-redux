const express = require('express')
const app = express()
const cors = require('cors')
const connectDB = require('./database/database')
const server = require('http').createServer(app)
const chatMessageModel = require('./database/Chat/chatSchema')
const chatRoomModel = require('./database/Chat/chatroomSchema')
const path = require('node:path')
const { fetchChatRooms } = require('./util/variables')
const isToxic = require('./util/chat')

//middleware
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

//Connect to MongoDB
connectDB()

//initialization functions
fetchChatRooms()

//Routes
const userRouter = require('./routes/users')
const chatRouter = require('./routes/chat')
app.use('/users', userRouter)
app.use('/chat', chatRouter)

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, './dist/index.html'), function(err) {
    if (err) {
      res.status(500).send(err)
    }
  })
})


const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

//socket
/* const io = require('socket.io')(server,{
  cors:{
    origin: 'https://baseball-redux-backend-1db26d31a3ab.herokuapp.com/',
    method: ['GET', 'POST']
  }
}) */

const io = require('socket.io')(server,{
  cors:{
    origin: 'http://localhost:5173',
    method: ['GET', 'POST']
  }
})

const rateLimits = {
  'chat message': { max: 5, windowMs: 60000 }, // 10 messages per minute
  'join room': { max: 1, windowMs: 2000}
}

let clients = {}

io.on('connection', (socket) => {
  clients[socket.id] = { tags: {}}
  console.log('a user connected')


  socket.on('join room', async (room) => {
    if (isRateLimited(socket.id, 'join room')) {
      socket.emit('rate_limit', 'You are joining rooms too fast')
      return
    }


    const chatRoomExists = await chatRoomModel.find({roomId: room})
    if(chatRoomExists.length > 0){
      console.log(`a user has joined "${room}" room`)
      socket.join(room)
      const messages = await chatMessageModel.find({ roomId: room }).sort({ timestamp: -1 }).limit(50)
      socket.emit('chat history', messages.reverse())
    } else {
      // Logic for when the chat room does not exist
      // Emit an error event or a specific message back to the user
      socket.emit('error message', 'Chat room does not exist.')
    }
  })

  socket.on('chat message', async ({room, msg, userId, userTeam}) => {
    //limit check
    if (isRateLimited(socket.id, 'chat message')) {
      socket.emit('rate_limit', 'You have exceeded the rate limit for chat messages.')
      return
    }
    console.log(userTeam)
    const chatRoomExists = await chatRoomModel.find({roomId: room})
    if(chatRoomExists.length > 0){
      const toxic = await isToxic(msg)
      console.log(toxic)
      if(toxic){
        socket.emit('toxic', 'Your message was evaluated to be toxic, please refrain from verbal abuse')
      } else {
        const timestamp = new Date()
        const newMessage = new chatMessageModel({userId: userId, roomId: room, message: msg, timestamp: timestamp, userTeam: userTeam})
        await newMessage.save()
        io.to(room).emit('chat message', {userId: userId, roomId: room, message: msg, timestamp: timestamp, userTeam: userTeam})
      }
    } else {
      // Logic for when the chat room does not exist
      // Emit an error event or a specific message back to the user
      socket.emit('error message', 'Chat room does not exist.')
    }
  })

  socket.on('disconnect', () => {
    console.log('user disconnected')
  })

})

function isRateLimited(socketId, tag){
  const now = Date.now()
  const clientData = clients[socketId]

  if (!clientData.tags[tag]) {
    clientData.tags[tag] = { count: 0, lastReset: now }
  }
  const tagData = clientData.tags[tag]

  if (now - tagData.lastReset > rateLimits[tag].windowMs) {
    tagData.count = 0
    tagData.lastReset = now
  }

  if (tagData.count >= rateLimits[tag].max) {
    return true
  } 

  tagData.count++
  return false
}