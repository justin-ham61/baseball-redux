import { createSlice } from '@reduxjs/toolkit'
import { PlayerBase } from '../type/PlayerBase'

const initialState:PlayerBase[] = []

const choiceSlice = createSlice({
  name: 'choice',
  initialState,
  reducers: {
    addChoice(state, action){
      const exists = state.some(item => item.playerId === action.payload.playerId)
      if(!exists){
        return [...state, action.payload]
      } else {
        return state
      }
    },
    emptyChoice(state){
      console.log(state)
      return []
    },
    setChoice(state, action){
      console.log(state)
      const newChoice = [action.payload]
      return newChoice
    },
    removeChoice(state, action){
      const filtered = state.filter(item => item.playerId !== action.payload.playerId)
      return filtered
    }
  }
})

export const {addChoice, emptyChoice, setChoice, removeChoice} = choiceSlice.actions

export default choiceSlice.reducer