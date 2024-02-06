/* eslint-disable @typescript-eslint/no-explicit-any */

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons'
interface Props{
  gameData: any
}
const Plays = ({gameData}:Props) => {
  return (
    <>
      {gameData.liveData.plays.playsByInning.map((item: any, i: number) => {
        return(
          <>
            <p className='play-inning away'>{i + 1}  <FontAwesomeIcon icon={faCaretUp}/>  </p>
            <ul className='play-list'>
          
              {item.top.map((code:string) => {
                return(
                  <li key={code} className={gameData.liveData.plays.scoringPlays.indexOf(code) !== -1 ? 'scoring' : ''}>
                    <p>
                      {gameData.liveData.plays.allPlays[code].result.description}
                    </p>
                    {gameData.liveData.plays.scoringPlays.indexOf(code) > -1 &&
                <p className='score'>
                  {gameData.liveData.plays.allPlays[code].result.homeScore} - {gameData.liveData.plays.allPlays[code].result.awayScore}
                </p>
                    }
                  </li>
                )
              })}
            </ul>


            <p className='play-inning home'>{i + 1}  <FontAwesomeIcon icon={faCaretDown}/> </p>
            <ul className='play-list'>
              {item.bottom.map((code:string) => {
                return(
                  <li className={gameData.liveData.plays.scoringPlays.indexOf(code) !== -1 ? 'scoring' : ''}>
                    <p>
                      {gameData.liveData.plays.allPlays[code].result.description}
                    </p>
                    {gameData.liveData.plays.scoringPlays.indexOf(code) > -1 &&
                <p className='score'>
                  {gameData.liveData.plays.allPlays[code].result.homeScore} - {gameData.liveData.plays.allPlays[code].result.awayScore}
                </p>
                    }
                  </li>
                )
              })}
            </ul>
          </>
        )
      })}
    </>
  )
}

export default Plays
