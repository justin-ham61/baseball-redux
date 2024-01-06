import ChartBox from '../ChartBox/ChartBox'
import ChartMenu from '../ChartMenu/ChartMenu'
import {useState} from 'react'
import './Chart.scss'
import FavoritePlayers from '../FavoritePlayers/FavoritePlayers'
import Login from '../Login/Login'
import Registration from '../Registration/Registration'
import * as React from 'react'

const Chart = () => {
  const [ selectedTeam, setSelectedTeam ] = useState(null)
  const [ showFavoritePlayer, setShowFavoritePlayer ] = useState(false)
  const [authType, setAuthType] = useState<string>('')

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if(e.key === 'Escape'){
      setAuthType('')
    }
  }
  
  return (
    <>
      <div className="chart">
        <ChartMenu setSelectedTeam={setSelectedTeam} showFavoriteState={{showFavoritePlayer, setShowFavoritePlayer}} setAuthType={setAuthType}/>
        <ChartBox selectedTeam={selectedTeam}/>
        
      </div>
      {showFavoritePlayer ? 
        <div className='favorite-player-overlay'>
          <FavoritePlayers showFavoriteState={{showFavoritePlayer, setShowFavoritePlayer}}/>
        </div>
        :
        null
      }
      {
        authType.length > 0  ? 
          <div className='favorite-player-overlay' onKeyDown={handleKeyDown}>
            {authType === 'login' ? <Login onClick={setAuthType}/> : authType === 'register' ? <Registration onClick={setAuthType}/> : null}
          </div>
          : null
      }
    </>


  )
}

export default Chart
