import axios from 'axios'
import {filterHitters} from '../util/dataFilter'
import { buildSinglePlayerDataset } from './charts'


const fetchDataPlayerByYear = async () => {
  const response = await axios.get('https://statsapi.mlb.com/api/v1/sports/1/players')
  const hitters = filterHitters(response.data.people)
  return hitters
}

export const fetchYearData = async (playerId:string, season:string) => {
  try{
    axios.get(`https://statsapi.mlb.com/api/v1/people/${playerId}/stats?stats=gameLog,statSplits,statsSingleSeason&leagueListId=mlb_hist&group=hitting&gameType=R&sitCodes=1,2,3,4,5,6,7,8,9,10,11,12&hydrate=team&season=${season}`)
      .then(response => {
        const data = buildSinglePlayerDataset(response.data.stats[0].splits)
        console.log(data)
        return(data)
      })
  } catch(err){
    console.log(err)
  }
}

export default { fetchDataPlayerByYear}