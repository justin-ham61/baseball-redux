/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import { useEffect, useState } from 'react'
import ChatWindow from '../ChatWindow/ChatWindow'
import {logoObject} from '../../images/teamlogo/index'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBaseballBatBall, faPeopleGroup, faChevronLeft, faChartLine, faUserGear } from '@fortawesome/free-solid-svg-icons'
import './ChatHero.scss'
import * as React from 'react'
import GameBox from '../GameBox/GameBox'
import { useNavigate, useParams } from 'react-router-dom'
import AccountMenu from '../AccountMenu/AccountMenu'
import { AnimatePresence, motion } from 'framer-motion'
import { faBookmark } from '@fortawesome/free-regular-svg-icons'
import { useQuery } from '@tanstack/react-query'
import { getSavedRoomCall } from '../../../util/query'

const ChatHero = () => {
  const { roomIdParam } = useParams()
  const navigate = useNavigate()
  const [ gameDate, setGameDate ] = useState<string>('')
  const [ roomCategory, setRoomCategory ] = useState<'games' | 'groups' | 'account' | 'saved'>('games')
  const [ selectedRoom, setSelectedRoom ] = useState<any>(null)
  const [ searchQuery, setSearchQuery ] = useState('')
  const [ gamesForDay, setGamesForDay ] = useState([])
  const [ filteredGames, setFilteredGames ] = useState([])
  const [ gameData, setGameData ] = useState(null)
  const [ savedRooms, setSavedRooms ] = useState<string[]>([])


  const savedRoomResult = useQuery({
    queryKey: ['savedChats'],
    queryFn: getSavedRoomCall
  })

  useEffect(() => {
    setSavedRooms(savedRoomResult.data)
  },[savedRoomResult])



  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }
  
  useEffect(():void => {
    const searchFieldLower = searchQuery.toLowerCase()
    const filteredList = gamesForDay.filter((item:any) => {
      const homeTeamName = item.teams.home.team.teamName.toLowerCase()
      const awayTeamName = item.teams.away.team.teamName.toLowerCase()
      // Check if either home or away team name includes the search field
      return homeTeamName.includes(searchFieldLower) || awayTeamName.includes(searchFieldLower)
    })
    setFilteredGames(filteredList)
  },[searchQuery, gamesForDay])


  useEffect(():void => {
    axios.get('http://localhost:3001/chat/chatrooms')
      .then(response => {
        console.log(response.data)
        setGamesForDay(response.data.data)
        setGameDate(response.data.gamedate)
      })
      .catch(error => {
        console.log(error)
      })
  },[])
  
  useEffect(():void => {
    if(roomIdParam){
      gamesForDay.forEach((game: any) => {
        if(game.gameGuid === roomIdParam){
          axios.get(`https://statsapi.mlb.com/api/v1.1/game/${game.gamePk}/feed/live`)
            .then(response => {
              setSelectedRoom(game)
              setGameData(response.data)
            })
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[gamesForDay])

  /*   useEffect(():void => {
    if(selectedRoom){
      axios.get(`https://statsapi.mlb.com/api/v1.1/game/${selectedRoom.gamePk}/feed/live`)
        .then(response => {
          setGameData(response.data)
        })
    }
  },[]) */

  const handleRoomChange = (game: any) => {
    console.log('changing room to ' + game.gamePk)
    axios.get(`https://statsapi.mlb.com/api/v1.1/game/${game.gamePk}/feed/live`)
      .then(response => {
        setGameData(response.data)
        setSelectedRoom(game)
        navigate(`/Chat/${game.gameGuid}`)
      })
  }

  function convertToPST(isoFormatStr:string):string {
    // Create a date object from the ISO format string
    const date = new Date(isoFormatStr)

    // Convert to PST timezone
    const pstDate = new Date(date.toLocaleString('en-US', {timeZone: 'America/Los_Angeles'}))

    // Format the time part in HH:MM:SS
    const hours = pstDate.getHours().toString().padStart(2, '0')
    const minutes = pstDate.getMinutes().toString().padStart(2, '0')

    return hours + ':' + minutes + ' PST'
  }


  return (
    <div className='chat-section'>
      {roomCategory === 'account' && <AccountMenu setRoomCategory={setRoomCategory}/>}
      <div className="chat-menu">
        <div className='chat-menu-item' onClick={() => navigate('/')}>
          <FontAwesomeIcon className='chat-menu-item-icon'  icon={faChevronLeft} />
        </div>
        <div className={`chat-menu-item ${roomCategory === 'games' && 'active'}`} onClick={() => setRoomCategory('games')}>
          <FontAwesomeIcon className='chat-menu-item-icon'  icon={faBaseballBatBall} />
        </div>
        <div className={`chat-menu-item ${roomCategory === 'groups' && 'active'}`} onClick={() => setRoomCategory('groups')}>
          <FontAwesomeIcon className='chat-menu-item-icon' icon={faPeopleGroup} />
        </div>
        <div className={`chat-menu-item ${roomCategory === 'saved' && 'active'}`} onClick={() => setRoomCategory('saved')}>
          <FontAwesomeIcon className='chat-menu-item-icon' icon={faBookmark} />
        </div>
        <div className={'chat-menu-item'} onClick={() => navigate('/Chart/1')}>
          <FontAwesomeIcon className='chat-menu-item-icon' icon={faChartLine} />
        </div>
        <div className={`chat-menu-item ${roomCategory === 'account' && 'active'}`} onClick={() => {setRoomCategory('account')}}>
          <FontAwesomeIcon className='chat-menu-item-icon' icon={faUserGear} />
        </div>
      </div>
      {roomCategory === 'games' && 
        <div className="chat-groups">
          <div className='chat-date'>
            <p>{gameDate}</p>
          </div>
          <div className='chat-search-section'>
            <input placeholder='Search for games today' className='chat-search-bar' type="text" value={searchQuery} maxLength={10} onChange={handleChange}/>
          </div>
          <AnimatePresence >
            {filteredGames.map((game:any, i) => {
              return(
                <motion.div key={i} className={`chat-room ${selectedRoom && selectedRoom.gamePk === game.gamePk && 'active'} ${game.status.statusCode === 'F' || game.status.statusCode === 'P' ? 'concluded' : 'live'}`} onClick={() => handleRoomChange(game)}
                  initial={{ opacity: 0, x: 30}}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  whileHover={{y: -10}}
                  transition={{ }}
                >
                  <div className='team'>
                    <img className='chat-room-logo' src={logoObject[game.teams.home.team.id as keyof unknown]} alt="" />
                    <p>{game.teams.home.team.teamName}</p>
                  </div>
                  <div>
                    <p className='score'>{game.linescore.teams.home.runs ? game.linescore.teams.home.runs : 0} : {game.linescore.teams.away.runs ? game.linescore.teams.away.runs : 0}</p>
                  </div>
                  <div className='team'>
                    <img className='chat-room-logo' src={logoObject[game.teams.away.team.id as keyof unknown]} alt="" />
                    <p>{game.teams.away.team.teamName}</p>
                  </div>
                  {game.linescore.currentInning ? <p className='inning'>{game.linescore.currentInning}</p> : <p className='inning'>{convertToPST(game.gameDate)}</p>}
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      }
      {roomCategory === 'saved' && 
      <div className='chat-groups'>
        <div className='chat-date'>
          <p>Saved Chatrooms</p>
        </div>
        <div className='chat-search-section'>
          <input placeholder='Search for saved chat' className='chat-search-bar' type="text" value={searchQuery} maxLength={10} onChange={handleChange}/>
        </div>
        {savedRooms.map((roomId: string, i: number) => {
          return(
            <div className='chat-room' key={i}>
              {roomId}
            </div>
          )
        })}
      </div>
      }
      {!selectedRoom && roomCategory === 'games' && <div className='no-room-selected'>Select a game to start talking!</div>}
      {selectedRoom  && gameData && roomCategory === 'games' && <ChatWindow gameData={gameData} selectedRoom={selectedRoom} roomId={selectedRoom.gamePk} savedRooms={savedRooms} key={selectedRoom.gamePk}/>}
      {selectedRoom && gameData && roomCategory === 'games'  && <GameBox gameData={gameData} selectedRoom={selectedRoom} key={selectedRoom.gamePk + 1}/>}
      {roomCategory === 'groups' || roomCategory === 'saved' ? <div className='no-room-selected'>This feature is not yet available</div> : null}

    </div>
  )
}

export default ChatHero
