import * as React from 'react'
import { type } from '../../util/constants'
import './ChartGameLogOptions.scss'
interface Props{
    statTypeState:{statType:string, setStatType: React.Dispatch<React.SetStateAction<string>>},
    involvedGameType: string[],
    setSeasonType: React.Dispatch<React.SetStateAction<string>>,
    seasonType: string
}

interface type{
  R: string,
  W: string,
  S: string,
  A: string,
  F: string,
  D: string,
  L: string,
  P: string
}


const ChartGameLogOptions = ({statTypeState, involvedGameType, setSeasonType, seasonType}:Props) => {

  const handleChange = (e: React.FormEvent<HTMLSelectElement>):void => {
    const type = e.currentTarget.value
    setSeasonType(type)
  }

  return (
    <div className='stat-selector' >
      <table>
        <tr className='type-selector'>
          <td className={statTypeState.statType === 'hitting' ? 'type left active' : 'type left'} onClick={() => statTypeState.setStatType('hitting')}>Batting</td>
          <td className={statTypeState.statType === 'fielding' ? 'type right active' : 'type right'} onClick={() => statTypeState.setStatType('fielding')}>Fielding</td>
        </tr>
      </table>
      <select onChange={handleChange} value={seasonType}>
        {involvedGameType.map(gameType => {
          return(
            <option key={gameType} value={gameType}>{type[gameType as keyof type]}</option>
          )
        })}
      </select>
    </div>
  )
}

export default ChartGameLogOptions
