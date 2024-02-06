import axios from 'axios'

interface newUserData {
    email:string,
    name:string,
    password:string,
    team: string
}

interface loginData{
  email: string,
  password: string
}

interface LoginReturnData{
  logged: boolean,
  email:string,
  name:string,
  id:string,
  team: string
}

interface UserPayload{
  logged: boolean
  name: string,
  email: string,
  id: string,
  favoritePlayers: number[],
  team: string
}

export const registerNewUser = async  (data: newUserData) => {
  return new Promise((resolve, reject) => {
    try{
      axios.post('http://localhost:3001/users/add', data)
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
      axios.post('http://localhost:3001/users/login', data)
        .then(result => {
          const token = result.data.token
          localStorage.setItem('token', token) // token received from server

          const userState:UserPayload = {
            logged: true,
            email: result.data.email,
            name: result.data.name, 
            id: result.data.id,
            favoritePlayers: [],
            team: result.data.team
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
    const result = await axios.post('http://localhost:3001/users/authtoken', {token})
    console.log(result)
    const user:UserPayload = {
      logged: true,
      name: result.data.name,
      id: result.data.id,
      email: result.data.email,
      favoritePlayers: [],
      team: result.data.team
    }
    return user
  } catch (error){
    console.log(error)
    return ({
      logged:false,
      name: '',
      id: '',
      email:'',
      favoritePlayers:[],
      team: ''
    })
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
    favoritePlayers: [],
    team: ''
  }
  return user
}
