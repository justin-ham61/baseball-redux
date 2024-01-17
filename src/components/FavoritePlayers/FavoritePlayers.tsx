import './FavoritePlayers.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import {logoObject} from '../images/teamlogo/index'
import { setChoice } from '../../reducers/choiceReducer'
import * as React from 'react'
import { State } from '../../type/stateType'
import { PlayerBase } from '../../type/PlayerBase'

interface Props{
  showFavoriteState:{
    showFavoritePlayer: boolean,
    setShowFavoritePlayer: React.Dispatch<React.SetStateAction<boolean>>,
  }
}

const FavoritePlayers = ({showFavoriteState}: Props) => {
  const [favoritePlayers, setFavoritePlayers ] = useState<PlayerBase[]>([])
  const user = useSelector((state:State)=> state.user)
  const players = useSelector((state:State) => state.player)
  const dispatch = useDispatch()

  useEffect(() => {
    const findPlayer = players.filter(player => user.favoritePlayers.indexOf(player.playerId) !== -1)
    findPlayer.sort((a, b) => a.teamId - b.teamId)
    setFavoritePlayers(findPlayer)
  },[players, user.favoritePlayers])

  const handleClick = (player: PlayerBase) => {
    dispatch(setChoice(player))
    showFavoriteState.setShowFavoritePlayer(false)
  }

  return (
    <div className='favorite-player-box'>
      <div className='favorite-player-box-header'>
        <h2>Favorite Players</h2>
        <FontAwesomeIcon icon={faXmark} size='xl' onClick={() => showFavoriteState.setShowFavoritePlayer(false)}/>
      </div>
      {
        user.logged ? 
          <ul className='user-favorite-players'>
            {favoritePlayers.map(player => {
              return(
                <li onClick={() => handleClick(player)}>
                  <div className='left'>
                    <img src={logoObject[player.teamId as keyof unknown]} alt="logo"/>
                    <div>
                      <p className='name'>{player.fullName}</p>
                      <p>{player.position.name} | #{player.pNumber}</p> 
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
          :
          <div className='sign-in-please'>
                Please sign in to select your favorite players
          </div>
      }
      {/* <div onClick={() => setShowEdit(true)}>Edit Favorite Players</div>
      {showEdit ? 
      <SearchBar/> : null
        } */}
    </div>
  )
}

export default FavoritePlayers
