const express = require('express')
const app = express()
const cors = require('cors')
const connectDB = require('./database/database')
const server = require('http').createServer(app)
const chatMessageModel = require('./database/Chat/chatSchema')
const path = require('node:path')

//middleware
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

//Connect to MongoDB
connectDB()

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


io.on('connection', (socket) => {
  console.log('a user connected')
  socket.on('join room', async (room) => {
    console.log(`a user has joined "${room}" room`)
    socket.join(room)
    const messages = await chatMessageModel.find({ roomId: room }).sort({ timestamp: 1 })
    socket.emit('chat history', messages)
  })

  socket.on('chat message', async ({room, msg, userId}) => {
    const timestamp = new Date()
    const newMessage = new chatMessageModel({userId: userId, roomId: room, message: msg, timestamp: timestamp})
    await newMessage.save()
    console.log(msg)
    io.to(room).emit('chat message', {userId: userId, roomId: room, message: msg, timestamp: timestamp})
  })

  
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})
