import { AnyAction, createSlice, ThunkAction, Dispatch } from '@reduxjs/toolkit'
import { State } from '../type/stateType'
import { loginUserWithToken } from '../util/auth'

interface UserPayLoad {
    logged: boolean
    name: string,
    email: string,
    favoritePlayers: number[]
    id: string,
    team: string
}

const initialState:UserPayLoad = {
  logged: false,
  name: '',
  email: '',
  favoritePlayers: [],
  id: '',
  team: ''
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers:{
    setUser(_state, action){
      return action.payload
    },
    setFavoritePlayer(state, action){
      const payload = {...state, favoritePlayers: action.payload}
      return payload
    }
  }
})

export const initializeAuth = (token:string): ThunkAction<void, State, null, AnyAction> => {
   
  return async (dispatch: Dispatch): Promise<void> => {
    const user:UserPayLoad | null = await loginUserWithToken(token)
    dispatch(setUser(user))
  }
}


export const { setUser, setFavoritePlayer } = userSlice.actions

export default userSlice.reducer
