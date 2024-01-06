import './ChartMenu.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faAngleUp, faCircleXmark, faUser, faUsers, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { faSquareGithub } from '@fortawesome/free-brands-svg-icons'
import SearchBar from '../SearchBar/SearchBar'
import { useDispatch, useSelector } from 'react-redux'
import { SetStateAction } from 'react'
import { setCategory } from '../../reducers/categoryReducer'
import { emptyChoice } from '../../reducers/choiceReducer'
import { AnimatePresence, motion } from 'framer-motion'
import { allTeams } from '../../util/constants'
import {logoObject} from '../images/teamlogo/index'
import american from '../images/teamlogo/american.png'
import national from '../images/teamlogo/national.png'
import { useNavigate } from 'react-router-dom'
import { signOutUser } from '../../util/auth'
import { setUser } from '../../reducers/userReducer'
import { useQueryClient } from '@tanstack/react-query'
import { State } from '../../type/stateType'


interface Props{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setSelectedTeam: React.Dispatch<SetStateAction<any>>,
  showFavoriteState:{
    showFavoritePlayer: boolean,
    setShowFavoritePlayer: React.Dispatch<SetStateAction<boolean>>,
  }
  setAuthType: React.Dispatch<SetStateAction<string>>
}

const ChartMenu = ({setSelectedTeam, showFavoriteState, setAuthType}: Props) => {
  const dispatch = useDispatch()
  const currentPlayer = useSelector((state:State) => state.choice)
  const category = useSelector((state:State) => state.category)
  const user = useSelector((state:State) => state.user)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const handleClick = (category:string) => {
    dispatch(setCategory(category))
  }

  const handleReturn = () => {
    dispatch(emptyChoice())
    dispatch(setCategory('single'))
    navigate('/')
  }

  const handleSignoutClick = () => {
    const outUser = signOutUser()
    dispatch(setUser(outUser))
    queryClient.invalidateQueries({queryKey:['favoritePlayers']})

  }
  
  return (
    <div className="chart-menu">
      <div className='chart-menu-main'>
        <div className='return-section'>
          <div className='return-button' onClick={handleReturn}>
            <FontAwesomeIcon icon={faChevronLeft}/>
            <p>Return</p>
          </div>
          {user.logged ? 
            <div className='hello-message'>
              <h2>Hello, {user.name}</h2>
            </div>
            :
            <div>
            
            </div>
          }
        </div>
        <motion.div className='menu-item'
          initial={{ height: 50 }}
          animate={{ height: category === 'single' && currentPlayer.length > 0 ? 260  :  category === 'single' && currentPlayer.length === 0 ? 120 : 50}}
        >
          <div className='menu-title' onClick={() => handleClick('single')}>
            <h1>One Player<FontAwesomeIcon icon={faUser} size='sm' className='menu-icon'/></h1>
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: category === 'single' ? 180 :  0}}
              transition={{
                duration: .3
              }}
            >
              <FontAwesomeIcon icon={faAngleUp} size="xl"/>
            </motion.div>
          </div>
          <AnimatePresence>
            {category === 'single' ? 
              <motion.div className='one-player'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0}}
              >
                {currentPlayer[0]? 
                  <>
                    <div className='player-name'>
                      <div>
                        <h2>{currentPlayer[0].fullName}</h2>
                        <p>{currentPlayer[0].position.name} | {currentPlayer[0].pNumber}</p>
                      </div>
                      <img src={logoObject[currentPlayer[0].teamId as keyof unknown]} alt='logo' />
                    </div>
                    <div className='player-bio'>
                      <p>Height: {currentPlayer[0].height}</p>
                      <p>Weight: {currentPlayer[0].weight}lbs</p>
                      <p>Birthday: {currentPlayer[0].birth}</p>
                    </div>
                  </>
                  : null}
                <div className='search'><SearchBar/></div>
              </motion.div>
              : null}
                      
          </AnimatePresence>
        </motion.div>


        <motion.div className='menu-item'
          initial={{ height: 50 }}
          animate={{ height: category === 'compare' ? (currentPlayer.length * 51 + 110) :  50}}
        >
          <div className='menu-title' onClick={() => handleClick('compare')}>
            <h1>Multiple Players<FontAwesomeIcon icon={faUserPlus} className='menu-icon'/></h1>
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: category === 'compare' ? 180 :  0}}
              transition={{
                duration: .3
              }}
            >
              <FontAwesomeIcon icon={faAngleUp} size="xl"/>
            </motion.div>
          </div>

          <AnimatePresence>
            {category === 'compare' ?
              <motion.div className='compare-player'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0}}
              >
                {currentPlayer.map((item, i:number) => {
                  return(
                    <div key={i} className='compare-player-single'>
                      <div className='player-card'>
                        <img src={logoObject[item.teamId as keyof unknown]} alt='logo' />
                        <h2>{item.fullName}</h2>
                      </div>
                      <FontAwesomeIcon icon={faCircleXmark} size='lg' onClick={() => {}}/>
                    </div>
                  )
                })}
                <div className='search-bar-section'><SearchBar/></div>
              </motion.div>
              :
              null
            }
          </AnimatePresence>
        </motion.div>
        <motion.div className='menu-item-team'
          initial={{ height: 60 }}
          //animate={{ height: category === 'team' ? '500px' :  60}}
          animate={{ flex: category === 'team' ? '1 0 auto' :  '0 1 auto'}}
        >
          <div className='menu-title' onClick={() => handleClick('team')}>
            <h1>Teams<FontAwesomeIcon icon={faUsers} size='sm' className='menu-icon'/></h1>
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: category === 'team' ? 180 :  0}}
              transition={{
                duration: .3
              }}
            >
              <FontAwesomeIcon icon={faAngleUp} size="xl"/>
            </motion.div>
          </div>
          <AnimatePresence>
            {category === 'team' ?
              <motion.div className='team'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0}}
              >
                <div>
                  <div className='league-name national'><p>National League</p><img src={national} alt={national} /></div>
                  <ul>
                    <li className='division-name nl'>NL West</li>
                    {allTeams[104][203].map(team => {
                      return(
                        <li className='team-name' onClick={() => setSelectedTeam(team)}><img src={logoObject[team.id as keyof unknown]}/>{team.name}</li>
                      )
                    })}
                  </ul>
                  <ul>
                    <li className='division-name nl'>NL Central</li>
                    {allTeams[104][205].map(team => {
                      return(
                        <li className='team-name' onClick={() => setSelectedTeam(team)}><img src={logoObject[team.id as keyof unknown]}/>{team.name}</li>
                      )
                    })}
                  </ul>
                  <ul>
                    <li className='division-name nl'>NL East</li>
                    {allTeams[104][204].map(team => {
                      return(
                        <li className='team-name' onClick={() => setSelectedTeam(team)}><img src={logoObject[team.id as keyof unknown]}/>{team.name}</li>
                      )
                    })}
                  </ul>
                  <div className='league-name american'><p>American League</p><img src={american} alt={american} /></div>
                  <ul>
                    <li className='division-name al'>AL West</li>
                    {allTeams[103][200].map(team => {
                      return(
                        <li className='team-name' onClick={() => setSelectedTeam(team)}><img src={logoObject[team.id as keyof unknown]}/>{team.name}</li>
                      )
                    })}
                  </ul>
                  <ul>
                    <li className='division-name al'>AL Central</li>
                    {allTeams[103][202].map(team => {
                      return(
                        <li className='team-name' onClick={() => setSelectedTeam(team)}><img src={logoObject[team.id as keyof unknown]}/>{team.name}</li>
                      )
                    })}
                  </ul>
                  <ul>
                    <li className='division-name al'>AL East</li>
                    {allTeams[103][201].map(team => {
                      return(
                        <li className='team-name' onClick={() => setSelectedTeam(team)}><img src={logoObject[team.id as keyof unknown]}/>{team.name}</li>
                      )
                    })}
                  </ul>
                </div>
              </motion.div>
              : null}
          </AnimatePresence>

        </motion.div>

      </div>
      <div className='chart-menu-account'>
        <div className='chart-menu-account-item'>Favorite Team</div>
        <div className='chart-menu-account-item' onClick={() => showFavoriteState.setShowFavoritePlayer(true)}>Favorite Players</div>
        {user.logged ? 
          <div className='chart-menu-account-item' onClick={() => handleSignoutClick()}>Sign Out</div> : 
          <div className='chart-menu-account-item' onClick={() => setAuthType('login')}>Sign In</div>
        }
      </div>
      <div className='chart-menu-footer'>
        <FontAwesomeIcon icon={faSquareGithub}/>
      </div>
    </div>
  )
}

export default ChartMenu
