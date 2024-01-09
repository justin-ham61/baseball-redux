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