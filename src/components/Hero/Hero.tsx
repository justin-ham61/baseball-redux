import './Hero.scss'
import SearchBar from '../SearchBar/SearchBar'
import HeroNav from '../HeroNav/HeroNav'
import Registration from '../Registration/Registration'
import { useRef, useState} from 'react'
import Login from '../Login/Login'
import { useSelector } from 'react-redux'
import { faSquareGithub } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Loading from '../Loading/Loading'
import { State } from '../../type/stateType'
import { useOutsideClickDetection } from '../../hooks/useOutsideClickDetection'
const Hero = () => {
  const [authType, setAuthType] = useState<string>('')
  const loading = useSelector((state:State) => state.loading)
  const wrapperRef = useRef(null)
  useOutsideClickDetection(wrapperRef, authType, setAuthType)

  /*  const popularPlayers = [
    {
      name: 'Bryce Harper',
      id: 547180,
      pic: headShotObject.bryce,
      pos: '1B'
    },
    {
      name: 'Ronald Acuna Jr.',
      id: 660670,
      pic: headShotObject.ronald,
      pos: 'RF'
    },
    {
      name: 'Freddie Freeman',
      id: 518692,
      pic: headShotObject.freddie,
      pos: '1B'
    },
    {
      name: 'Kyle Schwarber',
      id: 656941,
      pic: headShotObject.kyle,
      pos: 'DH'
    },
    {
      name: 'Yordan Alvarez',
      id: 670541,
      pic: headShotObject.yordan,
      pos: 'LF'
    },
  ]
 */
  /*   const handleTrendingClick = (playerId) => {
    axios.get(`https://statsapi.mlb.com/api/v1/people/${playerId}?hydrate=currentTeam,team,stats(type=[yearByYear,yearByYearAdvanced,careerRegularSeason,careerAdvanced,availableStats](team(league)),leagueListId=mlb_hist)&site=en`)
      .then(response => {
        console.log(response.data.people)
        const currentPerson = response.data.people[0]
      })
  } */



  const handleGithubClick = () => {
    window.open('https://github.com/justin-ham61/baseball-redux', '_blank', 'noreferrer')
  }

  return (
    <>
      <HeroNav setAuthType={setAuthType}/>
      <div className='body' ref={wrapperRef} >
        {loading ? <Loading/> :
          <>
            <div className='background'></div>
            <div className='filter'></div>
            <h1>MLB PLAYER CHART</h1>
            <div className='hero-search-container'>
              <SearchBar/>
            </div>
            {/* <div className='popular-player-section'>
              <h2>Popular Players</h2>
              <div className='trending-player'>
                {popularPlayers.map(player => {
                  if(player.pos !== "RHP" && player.pos !== "LHP"){
                    return(
                      <div className='player' onClick={() => handleTrendingClick(player.id)}>
                        <img src={player.pic} className="headshot"/>
                        <p>{player.name} | <span className='pos'>{player.pos}</span></p>
                      </div>
                    )
                  }
                })}
              </div>
            </div> */}
            {authType === 'login' ? <Login onClick={setAuthType}/> : authType === 'register' ? <Registration onClick={setAuthType}/> : null}
          </>
        }
      </div>
      <div className='footer'>
        <FontAwesomeIcon icon={faSquareGithub} onClick={handleGithubClick}/>
      </div>
    </>
  )
}

export default Hero
