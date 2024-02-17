import './Hero.scss'
import SearchBar from '../SearchBar/SearchBar'
import HeroNav from '../HeroNav/HeroNav'
import Registration from '../Registration/Registration'
import { useRef, useState, useEffect} from 'react'
import Login from '../Login/Login'
import { useSelector } from 'react-redux'
import { faSquareGithub } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Loading from '../Loading/Loading'
import { State } from '../../type/stateType'
import { useOutsideClickDetection } from '../../hooks/useOutsideClickDetection'
const Hero = () => {
  const [authType, setAuthType] = useState<string>('')
  const [ currentBackground, setCurrentBackground ] = useState<number>(0)
  const gifDuration:number = 6000
  const backgroundGifs: string[] = [
    'https://media1.giphy.com/media/tSVcXG3t6F7fIpFAWu/giphy.gif?cid=ecf05e479nrzf9muqb9pgqlvxbd1zsypnlw2x24aghe0taq9&ep=v1_gifs_related&rid=giphy.gif&ct=g',
    'https://media2.giphy.com/media/NTx2jKNZ0nG05pl5jr/giphy.gif',
    'https://media4.giphy.com/media/l29NnO7DSFsGYfNjGH/200.gif',
    'https://media2.giphy.com/media/4V0mAzoxs73gSl2wxz/giphy.gif?cid=6c09b95271ye6pwco2aaeot7uz4z5w8ywdvcorvs2htf62ds&ep=v1_gifs_search&rid=giphy.gif&ct=g',
  ]


  useEffect(() => {
    // Change the GIF after `gifDuration` milliseconds
    const timer = setTimeout(() => {
      setCurrentBackground((currentBackground + 1) % backgroundGifs.length)
    }, gifDuration)

    // Clear the timer if the component unmounts
    return () => clearTimeout(timer)
  }, [currentBackground, backgroundGifs.length])

  const loading = useSelector((state:State) => state.loading)
  const wrapperRef = useRef(null)
  useOutsideClickDetection(wrapperRef, authType, setAuthType)

  const handleGithubClick = () => {
    window.open('https://github.com/justin-ham61/baseball-redux', '_blank', 'noreferrer')
  }

  return (
    <>
      <HeroNav setAuthType={setAuthType}/>
      <div className='body' ref={wrapperRef} >
        {loading ? <Loading/> :
          <>
            <div key={currentBackground} className='background' style={{background: `url(${backgroundGifs[currentBackground]}) no-repeat center center/cover`,  width: '100%', height: '100%' }}></div>
            <div className='filter'></div>
            <h1 className='title'>THE DUGOUT</h1>
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
