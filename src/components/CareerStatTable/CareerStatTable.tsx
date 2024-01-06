/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from 'react'
import { hittingStatKeys } from '../../util/constants'

interface Props {
  currentPlayerCareerStats: any,
  error: any,
  statTypeState: any
}

const CareerStatTable = ({currentPlayerCareerStats, error, statTypeState}:Props) => {
  console.log(currentPlayerCareerStats)

  if (!error && statTypeState.statType === 'hitting'){
    return (
      <table className='stat-table'>
        <tr>
          <th>Season</th>
          <th>Team</th>
          <th>LG</th>
          <th><p>G</p></th>
          {hittingStatKeys.map((item, i) => {
            return(
              <th key={i}><p id={item.fullName}>{item.abbreviation}</p></th>
            )
          })}
        </tr>
        {currentPlayerCareerStats.map((item: { team: { abbreviation: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; league: { abbreviation: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined } }; season: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; stat: { [x: string]: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; gamesPlayed: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined } }, i:number) => {
          if(item.team)
            return(
              <tr key={i}>
                <td className='year'>{item.season}</td>
                <td>{item.team.abbreviation}</td>
                <td>{item.team.league.abbreviation}</td>
                <td>{item.stat.gamesPlayed}</td>
                {hittingStatKeys.map((key, i) => {
                  return(
                    <td key={i}>{item.stat[key.api]}</td>
                  )
                })}
              </tr>
            )
        })}
        <tr>
          <td className='year'>Career Total</td>
          <td> - - </td>
          <td> - - </td>
          <td>{currentPlayerCareerStats.reduce((accumulator:number, currentItem: { stat: { gamesPlayed: string } }) => {
            return accumulator + parseInt(currentItem.stat.gamesPlayed)
          }, 0)}</td>
          <td>{currentPlayerCareerStats.reduce((accumulator:number, currentItem: { stat: { atBats: string } }) => {
            return accumulator + parseInt(currentItem.stat.atBats)
          }, 0)}</td>
          <td>{currentPlayerCareerStats.reduce((accumulator:number, currentItem: { stat: { runs: string } }) => {
            return accumulator + parseInt(currentItem.stat.runs)
          }, 0)}</td>
          <td>{currentPlayerCareerStats.reduce((accumulator:number, currentItem: { stat: { hits: string } }) => {
            return accumulator + parseInt(currentItem.stat.hits)
          }, 0)}</td>
          <td>{currentPlayerCareerStats.reduce((accumulator:number, currentItem: { stat: { totalBases: string } }) => {
            return accumulator + parseInt(currentItem.stat.totalBases)
          }, 0)}</td>
          <td>{currentPlayerCareerStats.reduce((accumulator:number, currentItem: { stat: { doubles: string } }) => {
            return accumulator + parseInt(currentItem.stat.doubles)
          }, 0)}</td>
          <td>{currentPlayerCareerStats.reduce((accumulator:number, currentItem: { stat: { triples: string } }) => {
            return accumulator + parseInt(currentItem.stat.triples)
          }, 0)}</td>
          <td>{currentPlayerCareerStats.reduce((accumulator:number, currentItem: { stat: { homeRuns: string } }) => {
            return accumulator + parseInt(currentItem.stat.homeRuns)
          }, 0)}</td>
          <td>{currentPlayerCareerStats.reduce((accumulator:number, currentItem: { stat: { rbi: string } }) => {
            return accumulator + parseInt(currentItem.stat.rbi)
          }, 0)}</td>
          <td>{currentPlayerCareerStats.reduce((accumulator:number, currentItem: { stat: { baseOnBalls: string } }) => {
            return accumulator + parseInt(currentItem.stat.baseOnBalls)
          }, 0)}</td>
          <td>{currentPlayerCareerStats.reduce((accumulator:number, currentItem: { stat: { intentionalWalks: string } }) => {
            return accumulator + parseInt(currentItem.stat.intentionalWalks)
          }, 0)}</td>
          <td>{currentPlayerCareerStats.reduce((accumulator:number, currentItem: { stat: { strikeOuts: string } }) => {
            return accumulator + parseInt(currentItem.stat.strikeOuts)
          }, 0)}</td>
          <td>{currentPlayerCareerStats.reduce((accumulator:number, currentItem: { stat: { caughtStealing: string } }) => {
            return accumulator + parseInt(currentItem.stat.caughtStealing)
          }, 0)}</td>
          <td>{(currentPlayerCareerStats.reduce((accumulator:number, currentItem: { stat: { avg: string } }) => {
            return accumulator + parseFloat(currentItem.stat.avg)
          }, 0)/currentPlayerCareerStats.length).toFixed(3).toString().replace(/^0+/, '')}</td>
          <td>{(currentPlayerCareerStats.reduce((accumulator:number, currentItem: { stat: { obp: string } }) => {
            return accumulator + parseFloat(currentItem.stat.obp)
          }, 0)/currentPlayerCareerStats.length).toFixed(3).toString().replace(/^0+/, '')}</td>
          <td>{(currentPlayerCareerStats.reduce((accumulator:number, currentItem: { stat: { slg: string } }) => {
            return accumulator + parseFloat(currentItem.stat.slg)
          }, 0)/currentPlayerCareerStats.length).toFixed(3).toString().replace(/^0+/, '')}</td>
          <td>{(currentPlayerCareerStats.reduce((accumulator:number, currentItem: { stat: { ops: string } }) => {
            return accumulator + parseFloat(currentItem.stat.ops)
          }, 0)/currentPlayerCareerStats.length).toFixed(3).toString().replace(/^0+/, '')}</td>
          <td>{(currentPlayerCareerStats.reduce((accumulator:number, currentItem: { stat: { groundOutsToAirouts: string } }) => {
            return accumulator + parseFloat(currentItem.stat.groundOutsToAirouts)
          }, 0)/currentPlayerCareerStats.length).toFixed(2)}</td>
        </tr>
      </table>
    )
  } else if (!error && statTypeState.statType === 'fielding') {
    return(
      <table className='stat-table'>
        <tr>
          <th>Season</th>
          <th>Team</th>
          <th>LG</th>
          <th>POS</th>
          <th>G</th>
          <th>GS</th>
          <th>INN</th>
          <th>TC</th>
          <th>PO</th>
          <th>A</th>
          <th>E</th>
          <th>DP</th>
          <th>Fielding %</th>
        </tr>
        {currentPlayerCareerStats.map((item: { position: { abbreviation: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined }; season: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; team: { abbreviation: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; league: { abbreviation: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined } }; stat: { gamesPlayed: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; gamesStarted: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; innings: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; chances: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; putOuts: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; assists: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; errors: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; doublePlays: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; fielding: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined } }, i: number | null | undefined) => {
          if(item.position){
            return(
              <tr key={i}>
                <td className='year'>{item.season}</td>
                <td>{item.team.abbreviation}</td>
                <td>{item.team.league.abbreviation}</td>
                <td>{item.position.abbreviation}</td>
                <td>{item.stat.gamesPlayed}</td>
                <td>{item.stat.gamesStarted}</td>
                <td>{item.stat.innings}</td>
                <td>{item.stat.chances}</td>
                <td>{item.stat.putOuts}</td>
                <td>{item.stat.assists}</td>
                <td>{item.stat.errors}</td>
                <td>{item.stat.doublePlays}</td>
                <td>{item.stat.fielding}</td>
              </tr>
            )
          }
        })}

      </table>
    )
  } else {
    return(
      <div className='error'>
        <p>There is no data available for the selected stat type</p>
      </div>
    )
  }
}

export default CareerStatTable
