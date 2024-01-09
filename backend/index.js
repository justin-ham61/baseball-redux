const express = require('express')
const app = express()
const cors = require('cors')
const addUser = require('./database/User/user.js')
const connectDB = require('./database/database')


//middleware
app.use(express.json())
app.use(cors())

app.use(express.static('dist'))
//Connect to MongoDB
connectDB()

//Routes
const userRouter = require('./routes/users')
app.use('/users', userRouter)



app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})