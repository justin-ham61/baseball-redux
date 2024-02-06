import axios from 'axios'

export const addFavoritePlayerCall = async (playerId:number) => {
  const token = localStorage.getItem('token')
  const response = await axios.post('/users/favoriteplayers', {token, playerId})
  return response.data
}

export const getFavoritePlayerCall = async () => {
  const token = localStorage.getItem('token')
  const response = await axios.get(`/users/favoriteplayers/${token}`)
  return response.data
}

export const addSavedRoomCall = async (roomId: string) => {
  const token = localStorage.getItem('token')
  const response = await axios.post('http://localhost:3001/chat/savechat', {token: token, roomId: roomId})
  return response.data
}

export const getSavedRoomCall = async () => {
  const token = localStorage.getItem('token')
  const response = await axios.get(`http://localhost:3001/chat/savedchat/${token}`)
  return response.data
}

export const updateUsernameCall = async (username: string) => {
  const token = localStorage.getItem('token')
  const response = await axios.post('http://localhost:3001/users/updateusername', {token, username})
  return response.data
}

export const updateFavoriteTeamCall = async (team: string) => {
  const token = localStorage.getItem('token')
  const response = await axios.post('http://localhost:3001/users/updatefavoriteteam', {token, team})
  return response.data
}

export const deleteAccountCall = async() => {
  const token = localStorage.getItem('token')
  const response = await axios.post('http://localhost:3001/users/deleteaccount', {token})
  return response.data
}