/* eslint-disable @typescript-eslint/no-explicit-any */
import './ComparePlayersChart.scss'
import { useSelector } from 'react-redux'
import { Line } from 'react-chartjs-2'
import { buildComparePlayerDataset } from '../../util/charts'
import { useState, useEffect } from 'react'
import axios from 'axios'
 
import { defaultSeason } from '../../util/constants'
import { State } from '../../type/stateType'
import * as React from 'react'

const ComparePlayersChart = () => {
  const player = useSelector((state:State) => state.choice)
  const [category, setCategory] = useState('avg')
  const [chartData, setChartData] = useState<any>(null)
  const [season, setSeason] = useState(defaultSeason)
  const [error, setError] = useState(false)
  const options:any = {
    scales: {
      x: {
        type: 'category',
        position: 'bottom'
      },
      y: {
        beginAtZero: true,
        min: 0,
      }
    },
    datasets: {
      line:{
        spanGaps: true
      }
    },
  }

  useEffect(() => {
    fetchYearData()
    async function fetchYearData(){
      const data:any[] = []
          
      await Promise.all(player.map(person => {
        try{
          return new Promise<void>((resolve, reject) => {
            axios.get(`https://statsapi.mlb.com/api/v1/people/${person.playerId}/stats?stats=gameLog,statSplits,statsSingleSeason&leagueListId=mlb_hist&group=hitting&gameType=R&sitCodes=1,2,3,4,5,6,7,8,9,10,11,12&hydrate=team&season=${season}`)
              .then(response => {
                console.log(response.data.stats[0].splits)
                data.push(response.data.stats[0].splits)
                resolve()
              })
              .catch(error => {
                reject(error)
              })
          })
        }
        catch{
          console.error('There was an error fetching the data!')
        }
      }))
  
  
      const none = data.filter(item => item.length === 0)
  
      if(none.length === 0){
        setError(false)
        const dataset = buildComparePlayerDataset(data, category)
        setChartData(dataset)
        console.log(dataset)
      } else {
        setError(true)
      }
    }
  },[player, category, season])
  


  const handleRadioClick = (e:React.ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value)
    setCategory(e.target.value)
  }

  const handleChange = (e:React.ChangeEvent<HTMLSelectElement>) => {
    setSeason(e.target.value)
  }

  if (player.length === 0) {
    return(
      <div className='no-player-chosen'>
        <p>Please Search and Select a Player</p>
      </div>
    )
  } else {

  
    return (
      <div >
        <div className='chart-header-compare'>
          <div>
            <h2>Player Comparison for {season} Regular Season</h2>
          </div>
          <div className='season-selector'>
            <div>

              <label htmlFor="category-selector">Select Category to Compare: </label>
              <select className='category-selector' onChange={handleRadioClick} value={category}>
                <option value="avg">AVG</option>
                <option value="obp">OBP</option>
                <option value="ops">OPS</option>
                <option value="slg">SLG</option>
                <option value="rbi">RBI</option>
                <option value="homeRuns">Home Runs</option>
                <option value="hits">Hits</option>
                <option value="doubles">Doubles</option>
                <option value="triples">Triples</option>
                <option value="runs">Runs</option>
                <option value="baseOnBalls">Walks</option>
                <option value="intentionalWalks">Intentional Walks</option>
                <option value="atBats">At Bats</option>
                <option value="stolenBases">Stolen Bases</option>
                <option value="strikeOuts">Strike Outs</option>
                <option value="plateAppearances">Plate Appearances</option>
              </select>
            </div>
            <div>

              <label htmlFor="">Season: </label>
              <select name="" id="" value={season} onChange={handleChange}>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
                <option value="2020">2020</option>
              </select>
            </div>
          </div>
        </div>

        {chartData !== null && !error ? 

          <Line data={chartData} options={options}/>
          :
          error ? 
            <div>
            One of the selected players did not play in this season
            </div>
            :
            null}
      </div>
    )
  }
}

export default ComparePlayersChart
