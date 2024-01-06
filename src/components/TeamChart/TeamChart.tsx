/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState} from 'react'
import axios from 'axios'
import './TeamChart.scss'
import { Line} from 'react-chartjs-2'
import { logoObject } from '../images/teamlogo'
import { buildComparePlayerDataset } from '../../util/charts'
import { teamPlayerStatKeys } from '../../util/constants'

interface Props{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectedTeam: any
}
const TeamChart = ({selectedTeam}:Props) => {
  const [teamPlayersSeasonTable, setTeamPlayersSeasonTable] = useState([])
  const [teamPlayersSeasonChart, setTeamPlayersSeasonChart] = useState([])
  const [category, setCategory] = useState('avg')
  const [chartForm, setChartForm] = useState<any>({
    datasets:[
    ]
  })
  const yMaxRange = {
    avg: .4,
    obp: .5,
    ops: 1.1
  }
  const yMinRange = {
    avg: .1,
    obp: .2,
    ops: .5
  }

  const options:any = {
    scales: {
      x: {
        type: 'category',
        position: 'bottom'
      },
      y: {
        beginAtZero: true,
        max: yMaxRange[category as keyof unknown],
        min: yMinRange[category as keyof unknown]
      }
    },
    datasets: {
      line:{
        spanGaps: true
      }
    },
  }
  
  useEffect(() => {
    const fetchYearData = async () => {
      const data:any = []
      await Promise.all(teamPlayersSeasonChart.map((person:any) => {
        try{
          return new Promise<void>((resolve, reject) => {
            axios.get(`https://statsapi.mlb.com/api/v1/people/${person.id}/stats?stats=gameLog,statSplits,statsSingleSeason&leagueListId=mlb_hist&group=hitting&gameType=R&sitCodes=1,2,3,4,5,6,7,8,9,10,11,12&hydrate=team&season=2023`)
              .then(response => {
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
      const dataset = buildComparePlayerDataset(data, category)
      setChartForm(dataset)
      console.log(dataset)
    }
    fetchYearData()
  },[teamPlayersSeasonChart, category])

  useEffect(() => {
    const fetchTeamData = () => {
      try{
        axios.get(`https://bdfed.stitch.mlbinfra.com/bdfed/stats/player?stitch_env=prod&season=2023&sportId=1&stats=season&group=hitting&gameType=R&limit=25&offset=0&sortStat=homeRuns&order=desc&teamId=${selectedTeam.id}`)
          .then(response => {
            const chartPlayerArray:any = []
            const players = response.data.stats
            response.data.stats.map((player:any )=> {
              if(player.gamesPlayed > 100){
                const person = {
                  id: player.playerId
                }
                chartPlayerArray.push(person)
              }
            })
            setTeamPlayersSeasonChart(chartPlayerArray)
            setTeamPlayersSeasonTable(players)
          })
      } catch (error) {
        console.log(error)
      }
    }
    fetchTeamData()
  },[selectedTeam])

  const handleRadioClick = (e:React.ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value)
    setCategory(e.target.value)
  }
  if(selectedTeam !== null){
    return (
      <div>
        <div className='chart-header-team'>
          <div className='title'>
            <img src={logoObject[selectedTeam.id as keyof unknown]} alt="" />
            <h2>{selectedTeam.name}</h2>
          </div>
          <div className='season-selector'>
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
        </div>
        <Line data={chartForm} options={options}/>
        <div className='stat-table-section'>
          <table className="stat-table">
            <tr>
              <th>Player</th>
              <th>Team</th>
              <th>G</th>
              <th>AB</th>
              <th>R</th>
              <th>H</th>
              <th>2B</th>
              <th>3B</th>
              <th>HR</th>
              <th>RBI</th>
              <th>BB</th>
              <th>SO</th>
              <th>SB</th>
              <th>CS</th>
              <th>AVG</th>
              <th>OBP</th>
              <th>SLG</th>
              <th>OPS</th>
            </tr>
            {teamPlayersSeasonTable.map((player, i) => {
              return(
                <tr key={i}>
                  {teamPlayerStatKeys.map((key, i) => {
                    return(
                      <td key={i}>{player[key.api]}</td>
                    )
                  })}
                </tr>
              )
            })}
          </table>
        </div>
      </div>
    )
  } else {
    return(
      <div className='no-player-chosen'>
                    Please Select a team
      </div>
    )
  }
}

export default TeamChart


