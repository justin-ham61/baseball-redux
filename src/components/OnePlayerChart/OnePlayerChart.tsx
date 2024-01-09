import './OnePlayerChart.scss'
import ChartHeader from '../ChartHeader/ChartHeader'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { defaultSeason,type } from '../../util/constants'
import OnePlayerChartOptions from '../OnePlayerChartOptions/OnePlayerChartOptions'
import axios from 'axios'
import Graph from '../Graph/Graph'
import CareerStatTableSection from '../CareerStatTableSection/CareerStatTableSection'
import { State } from '../../type/stateType'


interface Type{
  R: string,
  W: string,
  S: string,
  A: string,
  F: string,
  D: string,
  L: string,
  P: string
}

const OnePlayerChart = () => {
  const currentPlayer = useSelector((state: State) => state.choice)
  const [ currentPlayerCareerStats, setCurrentPlayerCareerStats ] = useState([])
  const [ chartOptionCategory, setChartOptionCategory ] = useState('avg')
  const [ season, setSeason ] = useState<string>(defaultSeason)
  const [ checkbox, setCheckbox ] = useState<string[]>(['hits'])
  const [ statType, setStatType ] = useState<string>('hitting')
  const [involvedGameType, setInvolvedGameType] = useState<string[]>([])
  const [ seasonType, setSeasonType ] = useState<string>('R')
  const [error, setError] = useState<boolean>(false)


  useEffect(() => {
    const fetchCareerData = async () => {
      try{
        axios.get(`https://statsapi.mlb.com/api/v1/people/${currentPlayer[0].playerId}/stats?stats=yearByYear,career,yearByYearAdvanced,careerAdvanced&gameType=${seasonType}&leagueListId=mlb_hist&group=${statType}&hydrate=team(league)&language=en`)
          .catch(error => {
            console.error('There was an error', error)
          })
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .then((response: any) => {
            if(response.data.stats.length > 0){
              console.log(response.data.stats[0].splits)
              setCurrentPlayerCareerStats(response.data.stats[0].splits)
              setError(false)
            } else {
              console.log('error')
              setError(true)
            }
          })
      } catch (error){
        console.log(error)
      }
    }

    const fetchPlayerInfo = async () => {
      try{
        axios.get(`https://statsapi.mlb.com/api/v1/people/${currentPlayer[0].playerId}?hydrate=currentTeam,team,stats(type=[yearByYear,yearByYearAdvanced,careerRegularSeason,careerAdvanced,availableStats](team(league)),leagueListId=mlb_hist)&site=en`)
          .catch(error => {
            console.error('There was an error', error)
          })
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .then((response:any) => {
            console.log(response.data.people[0])
            const totalArray = setStatCategories(response.data.people[0])
            setInvolvedGameType(totalArray)
          })
        
      } catch (error){
        console.error('There was an error', error)
      }
    }
    fetchCareerData()
    fetchPlayerInfo()
  },[currentPlayer, seasonType, statType])



  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setStatCategories = (playerInfo: any) => {
    const splitArray = playerInfo.stats[6].splits
    console.log(splitArray)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const playerSplits:any = {}
    const totalArray = ['P']
    splitArray.map((split: { gameType: string; season: string }) => {
      if(type[split.gameType as keyof Type] !== null){
        console.log(playerSplits[split.season] + 'HELLOOOOOO')
        if(playerSplits[split.season] === undefined){
          playerSplits[split.season] = [split.gameType]
        } else {
          playerSplits[split.season].push(split.gameType)
        }
      }

      if(totalArray.indexOf(split.gameType) === -1 && type[split.gameType as keyof Type] !== null){
        totalArray.push(split.gameType)
      }
    })
    return totalArray
  }


  if(currentPlayer.length === 0){
    return(
      <div className='no-player-chosen'>
        <p>Please Search and Select a Player</p>
      </div>
    )
  } else {
    return (
      <div className='one-player-main'>
        <ChartHeader currentPlayer={currentPlayer[0]} season={season}/>
        <OnePlayerChartOptions setSeason={setSeason} currentPlayerCareerStats={currentPlayerCareerStats} season={season} chartOption={{chartOptionCategory, setChartOptionCategory}} checkboxState={{checkbox, setCheckbox}}/>
        <div className='graph'>
          <Graph season={season} currentPlayerId={currentPlayer[0].playerId} chartOption={{chartOptionCategory, setChartOptionCategory}} checkbox={checkbox}/>
        </div>
        <CareerStatTableSection currentPlayerCareerStats={currentPlayerCareerStats} involvedGameType={involvedGameType} setSeasonType={setSeasonType} seasonType={seasonType} error={error} statTypeState={{statType, setStatType}}/>


      </div>
    )
  }
}



export default OnePlayerChart
