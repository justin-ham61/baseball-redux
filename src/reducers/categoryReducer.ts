import { createSlice } from '@reduxjs/toolkit'

const initialState:string = 'single'

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers:{
    setCategory(state,action){
      console.log(state)
      return action.payload
    }
  }
})

export const { setCategory } = categorySlice.actions

export default categorySlice.reducer