const chatRouter = require('express').Router()
const { getChatRooms, gamedate } = require('../util/variables')
const userMethods = require('../util/Users')

chatRouter.get('/chatrooms', (req, res) => {
  const data = getChatRooms()
  if(data){
    res.json({data, gamedate})
  } else {
    res.status(503).send('Data not yet available')
  }
})

chatRouter.get('/savedchat/:token', async (req, res) => {
  const token = req.params.token
  const user = await userMethods.authenticateToken(token)
  if(user === undefined){
    res.status(200).send([])
  } else {
    const savedRooms = await userMethods.getSavedRooms(user.id)
    console.log(savedRooms)
    res.status(200).send(savedRooms)
  }
})

chatRouter.post('/savechat', async (req, res) => {
  const {token, roomId} = req.body
  const user = await userMethods.authenticateToken(token)
  const exists = await userMethods.checkExistingChatroom(user.id, roomId)
  if(exists){
    const result = await userMethods.deleteSavedRoom(user.id, roomId)
    setTimeout(() => {
      return res.status(200).send(result)
    }, 1000)
  } else if (!exists){
    const savedRoom = await userMethods.addSavedRoom(user.id, roomId)
    console.log(savedRoom)
    setTimeout(() => {
      return res.status(200).send(savedRoom)
    }, 1000)
  } else {
    return res.status(400).send('error')
  }
})


module.exports = chatRouter

