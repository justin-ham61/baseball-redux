import { createSlice } from '@reduxjs/toolkit'

const initialState:boolean = false

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    setLoading(state, action){
      console.log(state)
      return action.payload
    }
  }
})

export const { setLoading } = loadingSlice.actions

export default loadingSlice.reducer