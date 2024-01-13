/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { buildSinglePlayerAggregateData, buildSinglePlayerDataset } from '../../util/charts'
import axios from 'axios'
import './Graph.scss'
import { Line } from 'react-chartjs-2'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  LineController
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  LineController
)

interface Props{
  season:string
  currentPlayerId:number,
  chartOption:{chartOptionCategory:string, setChartOptionCategory:React.Dispatch<React.SetStateAction<string>>},
  checkbox:string[]
}

const Graph = ({season, currentPlayerId, chartOption, checkbox}:Props) => {

  const [ graphData, setGraphData ] = useState(null)
  const [ seasonStat, setSeasonStat ] = useState(null)

  useEffect(() => {
    fetchYearData(currentPlayerId, season)
  },[season, currentPlayerId])


  useEffect(() => {
    console.log(checkbox)
    
    if(seasonStat === null){
      return
    }
    if(chartOption.chartOptionCategory === 'avg'){
      const data:any = buildSinglePlayerDataset(seasonStat)
      setGraphData(data)
    } else if (chartOption.chartOptionCategory === 'agg'){
      const data:any = buildSinglePlayerAggregateData(seasonStat, checkbox)
      setGraphData(data)
    }
  },[chartOption.chartOptionCategory, seasonStat, checkbox])


  const fetchYearData = async (playerId:number, season:string) => {
    try{
      axios.get(`https://statsapi.mlb.com/api/v1/people/${playerId}/stats?stats=gameLog,statSplits,statsSingleSeason&leagueListId=mlb_hist&group=hitting&gameType=R&sitCodes=1,2,3,4,5,6,7,8,9,10,11,12&hydrate=team&season=${season}`)
        .then(response => {
          //Prints every stat that is received by the API calls
          const seasonStat = response.data.stats[0].splits
          setSeasonStat(seasonStat)
        })
    } catch(err){
      console.log(err)
    }
  }

  return(
    <>
      {graphData !== null ? <Line data={graphData}  key={chartOption.chartOptionCategory}/> : null }
    </>
  )
}

export default Graph
