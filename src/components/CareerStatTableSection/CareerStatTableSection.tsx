/* eslint-disable @typescript-eslint/no-explicit-any */

import './CareerStatTableSection.scss'
import ChartGameLogOptions from '../ChartGameLogOptions/ChartGameLogOptions'
import CareerStatTable from '../CareerStatTable/CareerStatTable'
import { Dispatch, SetStateAction } from 'react'

interface Props {
  currentPlayerCareerStats: any,
  involvedGameType: string[],
  setSeasonType: Dispatch<SetStateAction<string>>,
  seasonType: string,
  error: boolean,
  statTypeState:{
    statType:string,
    setStatType: Dispatch<SetStateAction<string>>
  }

}

const CareerStatTableSection = ({currentPlayerCareerStats, involvedGameType, setSeasonType, seasonType, error, statTypeState}:Props) => {
  return (
    <>
      <ChartGameLogOptions statTypeState={statTypeState} involvedGameType={involvedGameType} setSeasonType={setSeasonType} seasonType={seasonType} />
      <CareerStatTable currentPlayerCareerStats={currentPlayerCareerStats} error={error} statTypeState={statTypeState}/>
    </>
  )
}

export default CareerStatTableSection
