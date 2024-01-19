import { useEffect} from 'react'
import Hero from './components/Hero/Hero'
import Chart from './components/Chart/Chart'
import ChatHero from './components/Chat/ChatHero/ChatHero'
import './App.css'
import './index.css'
import { Route, Routes, BrowserRouter as Router} from 'react-router-dom'
import { initializePlayers } from './reducers/playersReducer'
import { initializeAuth, setFavoritePlayer } from './reducers/userReducer'
import { useDispatch} from 'react-redux'
import { useQuery } from '@tanstack/react-query'
import { getFavoritePlayerCall } from './util/query'



function App() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dispatch = useDispatch<any>()

  const favoritePlayerResult = useQuery({
    queryKey:['favoritePlayers'],
    queryFn: getFavoritePlayerCall
  })

  useEffect(() => {
    dispatch(initializePlayers())
    const token = localStorage.getItem('token')
    if(token){
      dispatch(initializeAuth(token))
    }
  },[dispatch])

  useEffect(() => {
    console.log(favoritePlayerResult)
    dispatch(setFavoritePlayer(favoritePlayerResult.data))
  },[favoritePlayerResult, dispatch])

/*   useEffect(() => {
    const socket = io('http://localhost:3001')
    socket.on('connection', () => {
      console.log('Connected to the socket.io server')
    })
    socket.emit('chat message', 'this is a test message')
    console.log('emmited mesage')
  },[]) */



  return (
    <> 
      <Router>
        <Routes>
          <Route path='/' element={ <Hero/>} />
          <Route path='/Chart' element={ <Chart/> } />
          <Route path='/Chat' element= {<ChatHero/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
