/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { buildSinglePlayerAggregateData, buildSinglePlayerDataset } from '../../util/charts'
import axios from 'axios'
import 'chartjs-adapter-date-fns'
import './Graph.scss'
import { Line } from 'react-chartjs-2'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  TimeScale,
  Tooltip,
  Legend,
  LineController,
} from 'chart.js'
import * as React from 'react'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
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

  const [ graphData, setGraphData ] = useState<any>(null)
  const [ seasonStat, setSeasonStat ] = useState(null)
  const [ min, setMin ] = useState('')
  const [ max, setMax ] = useState('')
  const [ filteredMin, setFilteredMin ] = useState([])
  const [ filteredMax, setFilteredMax ] = useState([])
  const options:any = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day'
        },
        min: min, // Set the minimum value of the X axis
        max: max, // Set the maximum value of the X axis
      },
    },
  }

  useEffect(() => {
    fetchYearData(currentPlayerId, season)
  },[season, currentPlayerId])

  useEffect(() => {
    if(seasonStat === null){
      return
    }
    if(chartOption.chartOptionCategory === 'avg'){
      const data:any = buildSinglePlayerDataset(seasonStat)
      console.log(data)
      setGraphData(data)
      setFilteredMin(data.labels)
      setFilteredMax(data.labels)
      setMin(data.labels[0])
      setMax(data.labels[data.labels.length - 1])
    } else if (chartOption.chartOptionCategory === 'agg'){
      const data:any = buildSinglePlayerAggregateData(seasonStat, checkbox)
      console.log(data)
      setGraphData(data)
    }
  },[chartOption.chartOptionCategory, seasonStat, checkbox])

  useEffect(() => {
    if(graphData !== null){
      const minOptions = graphData.labels.filter((label:string) => label < max)
      setFilteredMin(minOptions)
      // Filter options for the second select based on min
      const maxOptions = graphData.labels.filter((label:string) => label > min)
      setFilteredMax(maxOptions)
    }
  },[min, max, graphData])

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
  const changeMaxValue = (e:React.ChangeEvent<HTMLSelectElement>) => {
    setMax(e.target.value)
  }

  const changeMinValue = (e:React.ChangeEvent<HTMLSelectElement>) => {
    setMin(e.target.value)
  }
  return(
    <>
      {graphData !== null ? <Line options={options} data={graphData}  key={chartOption.chartOptionCategory}/> : null }
      <div className='date-selector-box'>
        {graphData !== null && filteredMin && filteredMax &&
          <>
            <select name="" id="" onChange={changeMinValue} value={min}>
              <option value=""></option>
              {filteredMin.map((item: string, i: number) => {
                return(
                  <option key={i} value={item}>{item}</option>
                )
              })}
            </select>
            <select name="" id="" onChange={changeMaxValue} value={max}>
              {filteredMax.map((item:string, i: number) => {
                return(
                  <option key={i} value={item}>{item}</option>
                )
              })}
            </select>
          </>
        }
      </div>
    </>
  )
}

export default Graph
