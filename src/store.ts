import { configureStore } from '@reduxjs/toolkit'
import playersReducer from './reducers/playersReducer'
import choiceReducer from './reducers/choiceReducer'
import userReducer from './reducers/userReducer'
import loadingReducer from './reducers/loadingReducer'
import categoryReducer from './reducers/categoryReducer'

const store = configureStore({
  reducer: {
    player: playersReducer,
    choice: choiceReducer,
    category: categoryReducer,
    user: userReducer,
    loading: loadingReducer
  }
})

store.subscribe(() => {
  const storeNow = store.getState()
  console.log(storeNow)
})

export default store