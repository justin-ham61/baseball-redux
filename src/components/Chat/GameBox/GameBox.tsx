/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from 'react'
import './GameBox.scss'
import Plays from '../Plays/Plays'
import { AnimatePresence, motion } from 'framer-motion'

interface Props {
    selectedRoom: any,
    gameData: any
    setShowBoxScoreMobile: React.Dispatch<React.SetStateAction<'flex' | 'none'>>,
    showBoxScoreMobile: 'flex' | 'none'
}

const GameBox = ({selectedRoom, gameData, showBoxScoreMobile, setShowBoxScoreMobile}: Props) => {
  const [ totals, setTotalBattingBox ] = useState<any|null>(null)
  const [ teamSelection, setTeamSelection ] = useState('home')
  const [ category, setCategory ] = useState('box')

  useEffect(() => {
    console.log(gameData)
    if(gameData){
      const totals = gameData.liveData.boxscore.teams[teamSelection].battingOrder.reduce((acc: { atBats: any; runs: any; hits: any; rbi: any; baseOnBalls: any; strikeOuts: any; leftOnBase: any }, batterId: number) => {
        const stats = gameData.liveData.boxscore.teams[teamSelection].players['ID' + batterId].stats.batting
        acc.atBats += stats.atBats
        acc.runs += stats.runs
        acc.hits += stats.hits
        acc.rbi += stats.rbi
        acc.baseOnBalls += stats.baseOnBalls
        acc.strikeOuts += stats.strikeOuts
        acc.leftOnBase += stats.leftOnBase
        return acc
      }, { atBats: 0, runs: 0, hits: 0, rbi: 0, baseOnBalls: 0, strikeOuts: 0, leftOnBase: 0 })
      setTotalBattingBox(totals)
    }
  },[gameData, teamSelection])

  function formatName(name:string) {
    // Split the name into parts
    const parts = name.split(' ')

    // Check if the name consists of more than one word
    if (parts.length > 1) {
      // Assume the last word is the surname and the first word is the given name
      const givenName = parts.shift()
      const surname = parts.join(' ')
      // Return the formatted name
      if(givenName){
        return `${surname}, ${givenName.charAt(0)}`
      }
    } else {
      // If the name is a single word, just return it
      return name
    }
  }

  if(!gameData){
    return(
      null
    )
  }

  return (
    <AnimatePresence>
      <motion.div className='gamebox-section' style={{display: showBoxScoreMobile}}
        initial={{x: 400, opacity:0}}
        animate={{x: 0, opacity: 1}}
        exit={{x: 400, opacity: 0}}
        transition={{duration: .2}}
        key={showBoxScoreMobile}
      >
        <button className='mobile-hide-button' onClick={() => setShowBoxScoreMobile('none')}>RETURN</button>
        <div className="table-type-section">
          <div className={`table-type ${category === 'box' && 'active'}`} onClick={() => setCategory('box')}>BOX</div>
          <div className={`table-type ${category === 'plays' && 'active'}`} onClick={() => setCategory('plays')}>PLAYS</div>
        </div>
        {category === 'box' &&
      <>
        <div className="team-selection-section">
          <div onClick={() => setTeamSelection('home')}>{selectedRoom.teams.home.team.teamName}</div>
          <div onClick={() => setTeamSelection('away')}>{selectedRoom.teams.away.team.teamName}</div>
        </div>
        <div className='line-up-section'>
          {gameData &&
          <>
            <table className='line-up-table'>
              <tr>
                <th className='table-header'>{selectedRoom.teams[teamSelection].team.abbreviation} Batters</th>
                <th>AB</th>
                <th>R</th>
                <th>H</th>
                <th>RBI</th>
                <th>BB</th>
                <th>SO</th>
                <th>LOB</th>
                <th>AVG</th>
                <th>OPS</th>
              </tr>
              {gameData.liveData.boxscore.teams[teamSelection].battingOrder.map((batterId:number, i:number) => {
                return(
                  <tr>
                    <td className='table-header'>{i+1} {formatName(gameData.liveData.boxscore.teams[teamSelection].players['ID'+batterId].person.fullName)}<span> {gameData.liveData.boxscore.teams[teamSelection].players['ID'+batterId].position.abbreviation}</span></td>
                    <td>{gameData.liveData.boxscore.teams[teamSelection].players['ID'+batterId].stats.batting.atBats}</td>
                    <td>{gameData.liveData.boxscore.teams[teamSelection].players['ID'+batterId].stats.batting.runs}</td>
                    <td>{gameData.liveData.boxscore.teams[teamSelection].players['ID'+batterId].stats.batting.hits}</td>
                    <td>{gameData.liveData.boxscore.teams[teamSelection].players['ID'+batterId].stats.batting.rbi}</td>
                    <td>{gameData.liveData.boxscore.teams[teamSelection].players['ID'+batterId].stats.batting.baseOnBalls}</td>
                    <td>{gameData.liveData.boxscore.teams[teamSelection].players['ID'+batterId].stats.batting.strikeOuts}</td>
                    <td>{gameData.liveData.boxscore.teams[teamSelection].players['ID'+batterId].stats.batting.leftOnBase}</td>
                    <td>{gameData.liveData.boxscore.teams[teamSelection].players['ID'+batterId].seasonStats.batting.avg}</td>
                    <td>{gameData.liveData.boxscore.teams[teamSelection].players['ID'+batterId].seasonStats.batting.ops}</td>
                  </tr>
                )
              })}
              {totals &&
              <tr>
                <td>Total</td>
                <td>{totals.atBats}</td>
                <td>{totals.runs}</td>
                <td>{totals.hits}</td>
                <td>{totals.rbi}</td>
                <td>{totals.baseOnBalls}</td>
                <td>{totals.strikeOuts}</td>
                <td>{totals.leftOnBase}</td>
                {/* Empty cells for 'avg' and 'ops' */}
                <td></td>
                <td></td>
              </tr>
              }
            </table>
            <table className='line-up-table'>
              <tr>
                <th className='table-header'>{selectedRoom.teams[teamSelection].team.abbreviation} Pitchers</th>
                <th>IP</th>
                <th>H</th>
                <th>R</th>
                <th>ER</th>
                <th>BB</th>
                <th>SO</th>
                <th>HR</th>
                <th>ERA</th>
              </tr>
              {gameData.liveData.boxscore.teams[teamSelection].pitchers.map((id:number, i:number) => {
                return(
                  <tr>
                    <td className='table-header'>{i+1} {formatName(gameData.liveData.boxscore.teams[teamSelection].players['ID'+id].person.fullName)}<span> {gameData.liveData.boxscore.teams[teamSelection].players['ID'+ id].position.abbreviation}</span></td>
                    <td>{gameData.liveData.boxscore.teams[teamSelection].players['ID'+id].stats.pitching.inningsPitched}</td>
                    <td>{gameData.liveData.boxscore.teams[teamSelection].players['ID'+id].stats.pitching.hits}</td>
                    <td>{gameData.liveData.boxscore.teams[teamSelection].players['ID'+id].stats.pitching.runs}</td>
                    <td>{gameData.liveData.boxscore.teams[teamSelection].players['ID'+id].stats.pitching.earnedRuns}</td>
                    <td>{gameData.liveData.boxscore.teams[teamSelection].players['ID'+id].stats.pitching.baseOnBalls}</td>
                    <td>{gameData.liveData.boxscore.teams[teamSelection].players['ID'+id].stats.pitching.strikeOuts}</td>
                    <td>{gameData.liveData.boxscore.teams[teamSelection].players['ID'+id].stats.pitching.homeRuns}</td>
                    <td>{gameData.liveData.boxscore.teams[teamSelection].players['ID'+id].seasonStats.pitching.era}</td>
                  </tr>
                )
              })}
            </table>
          </>
          }
        </div>
      </>
        }
        {category === 'plays' &&
        <Plays gameData={gameData}/>
        }
      </motion.div>
    </AnimatePresence>
  )
}

export default GameBox
