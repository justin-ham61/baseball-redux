import { AnyAction, createSlice, Dispatch } from '@reduxjs/toolkit'
import { PlayerBase } from '../type/PlayerBase'
import { ThunkAction } from 'redux-thunk'
import { State } from '../type/stateType' // Adjust the import path as needed
import playerService from '../util/dataFetch'

const initialState:PlayerBase[] =  []

const playerSlice = createSlice({
  name: 'players',
  initialState,
  reducers: {
    setPlayers(state, action) {
      console.log(state)
      return action.payload
    }
  },
})
  
export const initializePlayers = (): ThunkAction<void, State, null, AnyAction> => {
  return async (dispatch: Dispatch): Promise<void> => {
    const people: PlayerBase[] = await playerService.fetchDataPlayerByYear()
    dispatch(setPlayers(people))
  }
}

export const { setPlayers } = playerSlice.actions
  
export default playerSlice.reducer