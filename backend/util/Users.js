const User = require('../database/User/userSchema')
const Player = require('../database/Player/playerSchema')
const SavedRoom = require('../database/Chat/chatroomSave')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const jwtSecretKey = process.env.JWTSECRET

const userMethods = {
  add: async function(data){
    const {email, name, password, team} = data
    const saltRounds = 8
    const passwordHash = await bcrypt.hash(password, saltRounds)
    const userInfo = {
      email: email, 
      name: name,
      passwordHash: passwordHash, 
      team: team
    }
    const user = new User(userInfo)
    await user.save()
    return user
  },
  delete: async function(data){
    try{
      await User.deleteOne({ email: data.email})
      return true
    }
    catch (error){
      return error
    }
  },
  getByEmail: async function(email){
    return new Promise((resolve, reject) => {
      User.find({'email': email})
        .then(results => {
          resolve(results)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  authenticate: async function(password, user){
    const passwordCorrect = await bcrypt.compare(password, user.passwordHash)
    if(!passwordCorrect){
      return false
    } 
    const userForToken = {
      email: user.email,
      id: user._id,
      name: user.name,
      team: user.team
    }

    const token = jwt.sign(userForToken, jwtSecretKey, { expiresIn: 3600*24 })
    return token
  },
  authenticateToken: async function(token){
    try{
      const decodedToken = jwt.verify(token, jwtSecretKey)
      return decodedToken
    } catch (error){
      if(error.name === 'JsonWebTokenError'){
        return false
      }
    }
  },
  addFavoritePlayer: async function(userId, playerId){
    console.log('addFavoritePlayer called')
    const favoriteInfo = {
      userId: userId,
      playerId: playerId
    }
    const favoritePlayer = new Player(favoriteInfo)
    await favoritePlayer.save()
    return favoritePlayer
  },
  addSavedRoom: async function(userId, roomId){
    const favoriteInfo = {
      userId: userId,
      roomId: roomId
    }
    const savedRoom = new SavedRoom(favoriteInfo)
    await savedRoom.save()
    console.log(userId + ' added ' + roomId)
    return savedRoom
  },
  deleteFavoritePlayer: async function(userId, playerId){
    const result = await Player.deleteMany({
      'userId': userId,
      'playerId': playerId
    })
    return result
  },
  deleteSavedRoom: async function(userId, roomId){
    const result = await SavedRoom.deleteMany({
      'userId': userId,
      'roomId': roomId
    })
    console.log(userId + ' deleted ' + roomId)
    return result
  },
  getFavoritePlayers: async function(userId){
    return new Promise((resolve, reject) => {
      Player.find({'userId': userId})
        .then(results=> {
          resolve(results.map(result => result.playerId))
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  getSavedRooms: async function(userId){
    return new Promise((resolve, reject) => {
      SavedRoom.find({'userId': userId})
        .then(results=> {
          resolve(results.map(result => result.roomId))
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  checkExistingFavoritePlayer: async function(userId, playerId){
    const exists = await Player.findOne({'userId': userId, 'playerId': playerId})
    return exists !== null
  },
  checkExistingChatroom: async function(userId, roomId){
    const exists = await SavedRoom.findOne({'userId': userId, 'roomId': roomId})
    return exists !== null
  },
  updateUsername: async function(user,username){
    const updatedUser = await User.findOneAndUpdate(
      {email: user.email},
      {$set: {name: username}},
      {
        returnDocument: 'after',
        upsert: false
      }
    )

    const userForToken = {
      email: updatedUser.email,
      id: updatedUser._id,
      name: updatedUser.name,
      team: updatedUser.team
    }

    const newToken = jwt.sign(userForToken, jwtSecretKey,{expiresIn: 3600*24})
    userForToken.token = newToken
    return userForToken
  },
  updateFavoriteTeam: async function(user,team){
    const updatedUser = await User.findOneAndUpdate(
      {email: user.email},
      {$set: {team: team}},
      {
        returnDocument: 'after',
        upsert: false
      }
    )

    const userForToken = {
      email: updatedUser.email,
      id: updatedUser._id,
      name: updatedUser.name,
      team: updatedUser.team
    }

    const newToken = jwt.sign(userForToken, jwtSecretKey,{expiresIn: 3600*24})
    userForToken.token = newToken
    return userForToken
  },
}

module.exports = userMethods
