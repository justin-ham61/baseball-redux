const express = require('express')
const app = express()
const cors = require('cors')
const connectDB = require('./database/database')
const server = require('http').createServer(app)

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


app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

//socket
const io = require('socket.io')(server,{
  cors:{
    origin: 'http://localhost:5173',
    method: ['GET', 'POST']
  }
})


io.on('connection', (socket) => {
  console.log('a user connected')
  
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })

  socket.on('chat message', (msg) => {
    console.log(msg)
    io.emit('chat message', msg)
  })
})
