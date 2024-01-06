import axios from 'axios'
import {baseUrl} from './constants'

interface newUserData {
    email:string,
    name:string,
    password:string
}

interface loginData{
  email: string,
  password: string
}

interface LoginReturnData{
  logged: boolean,
  email:string,
  name:string,
  id:string
}

interface UserPayload{
  logged: boolean
  name: string,
  email: string,
  id: string,
  favoritePlayers: number[]
}

export const registerNewUser = async  (data: newUserData) => {
  return new Promise((resolve, reject) => {
    try{
      axios.post(`${baseUrl}/users/add`, data)
        .then(result=> {
          console.log(result.data)
          alert('Successfully Registered')
          resolve(true)
        })
        .catch(error => {
          console.log(error.response.data.message)
          alert('Email is already registered')
          reject(false)
        })
    } catch (error){
      console.log(error)
    }
  })
}

export const loginUser = async (data: loginData):Promise<LoginReturnData> => {
  return new Promise((resolve, reject) => {
    try{
      axios.post(`${baseUrl}/users/login`, data)
        .then(result => {
          const token = result.data.token
          const user = {
            email: result.data.email,
            name: result.data.name,
            id: result.data.id
          }
          localStorage.setItem('token', token) // token received from server
          localStorage.setItem('userInfo', JSON.stringify(user)) // user information as an object

          const userState:UserPayload = {
            logged: true,
            email: result.data.email,
            name: result.data.name, 
            id: result.data.id,
            favoritePlayers: []
          }
          resolve(userState)
        })
        .catch(error => {
          console.log(error.response.data.message)
          reject(null)
        })
    } catch (error){
      console.log(error)
    }
  })
}

export const loginUserWithToken = async (token:string):Promise<UserPayload | null>=> {
  try{
    const result = await axios.post(`${baseUrl}/users/authtoken`, {token})
    const user:UserPayload = {
      logged: true,
      name: result.data.name,
      id: result.data.id,
      email: result.data.email,
      favoritePlayers: []
    }
    return user
  } catch (error){
    console.log(error)
    return null
  }
}

export const signOutUser = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('userInfo')
  const user:UserPayload = {
    logged:false,
    name: '',
    id: '',
    email: '',
    favoritePlayers: []
  }
  return user
}
