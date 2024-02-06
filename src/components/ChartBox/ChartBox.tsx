import { useDispatch, useSelector } from 'react-redux'
import ComparePlayersChart from '../ComparePlayersChart/ComparePlayersChart'
import OnePlayerChart from '../OnePlayerChart/OnePlayerChart'
import TeamChart from '../TeamChart/TeamChart'
import './ChartBox.scss'
import { State } from '../../type/stateType'
import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import {setChoice} from '../../reducers/choiceReducer'

interface Props{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectedTeam: any
}


const ChartBox = ({selectedTeam}:Props) => {
  const {playerIdParam} = useParams()
  const players = useSelector((state: State) => state.player)
  const category = useSelector((state: State) => state.category)
  const dispatch = useDispatch()

  useEffect(() => {
    if(!playerIdParam){
      return
    }

    if(playerIdParam.length === 6){
      const findPlayer = players.find(player => player.playerId.toString() === playerIdParam)
      if(findPlayer){
        dispatch(setChoice(findPlayer))
      }
    }

  },[players, playerIdParam, dispatch])

  return (
    <div className='chart-box'>
      {category === 'single' ? 
        <OnePlayerChart/> : 
        category === 'compare' ? 
          <ComparePlayersChart/>
          : 
          category === 'team' ? 
            <TeamChart selectedTeam={selectedTeam}/>
            : 
            null
      }
    </div>
  )
}

export default ChartBox
