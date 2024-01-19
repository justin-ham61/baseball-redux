/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import { useEffect, useState } from 'react'
import ChatWindow from '../ChatWindow/ChatWindow'
import {logoObject} from '../../images/teamlogo/index'
import './ChatHero.scss'
import * as React from 'react'

const ChatHero = () => {
  const [ selectedRoom, setSelectedRoom ] = useState<any>(null)
  const [ searchQuery, setSearchQuery ] = useState('')
  const [ gamesForDay, setGamesForDay ] = useState([])
  const [ filteredGames, setFilteredGames ] = useState([])


  //This api call gets the schedule of all games in a day
  //'https://bdfed.stitch.mlbinfra.com/bdfed/transform-mlb-schedule?stitch_env=prod&sortTemplate=5&sportId=1&&sportId=51&&sportId=21&startDate=2024-04-01&endDate=2024-04-01&gameType=E&&gameType=S&&gameType=R&&gameType=F&&gameType=D&&gameType=L&&gameType=W&&gameType=A&language=en&leagueId=104&&leagueId=103&&leagueId=160&&leagueId=590&contextTeamId='
  //This api call is for the status of a game given their gamePk which can be retrieved from the schedule
  //'https://statsapi.mlb.com/api/v1.1/game/746817/feed/live'
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  useEffect(() => {
    const searchFieldLower = searchQuery.toLowerCase()
    const filteredList = gamesForDay.filter((item:any) => {
      const homeTeamName = item.teams.home.team.teamName.toLowerCase()
      const awayTeamName = item.teams.away.team.teamName.toLowerCase()

      // Check if either home or away team name includes the search field
      return homeTeamName.includes(searchFieldLower) || awayTeamName.includes(searchFieldLower)
    })
    setFilteredGames(filteredList)
  },[searchQuery, gamesForDay])

  useEffect(() => {
    axios.get('https://bdfed.stitch.mlbinfra.com/bdfed/transform-mlb-schedule?stitch_env=prod&sortTemplate=5&sportId=1&&sportId=51&&sportId=21&startDate=2024-04-01&endDate=2024-04-01&gameType=E&&gameType=S&&gameType=R&&gameType=F&&gameType=D&&gameType=L&&gameType=W&&gameType=A&language=en&leagueId=104&&leagueId=103&&leagueId=160&&leagueId=590&contextTeamId=')
      .then(response => {
        console.log(response.data.dates[0].games)
        setGamesForDay(response.data.dates[0].games)
      })
  },[])


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
      <div className="chat-menu"></div>
      <div className="chat-groups">
        <div className='chat-date'>
          <p>04-01-2024</p>
        </div>
        <div className='chat-search-section'>
          <input className='chat-search-bar' type="text" value={searchQuery} maxLength={10} onChange={handleChange}/>
        </div>
        {filteredGames.map((game:any, i) => {
          return(
            <div className={`chat-room ${selectedRoom === game ? 'active' : null} ${game.status.statusCode === 'F' || game.status.statusCode === 'P' ? 'concluded' : 'live'}`} key={i} onClick={() => setSelectedRoom(game)}>
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
            </div>
          )
        })}
      </div>
      {selectedRoom && <ChatWindow selectedRoom={selectedRoom} roomId={selectedRoom.gamePk} key={selectedRoom.gamePk}/>}
    </div>
  )
}

export default ChatHero
