import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import ComparePlayersChart from '../ComparePlayersChart/ComparePlayersChart'
import OnePlayerChart from '../OnePlayerChart/OnePlayerChart'
import TeamChart from '../TeamChart/TeamChart'
import './ChartBox.scss'
import { State } from '../../type/stateType'
interface Props{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectedTeam: any
}


const ChartBox = ({selectedTeam}:Props) => {
  const category = useSelector((state: State) => state.category)
  useEffect(() => {
    console.log(category)
  })
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
