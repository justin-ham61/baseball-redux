 

import './AccountMenu.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark, faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from 'react-redux'
import { State } from '../../../type/stateType'
import Login from '../../Login/Login'
import { useEffect, useState } from 'react'
import Registration from '../../Registration/Registration'
import { teamCodeNames } from '../../../util/constants'
import { AnimatePresence, motion } from 'framer-motion'
import * as React from 'react'
import { useMutation } from '@tanstack/react-query'
import { deleteAccountCall, updateFavoriteTeamCall, updateUsernameCall } from '../../../util/query'
import { setUser } from '../../../reducers/userReducer'

interface Props{
    setRoomCategory: React.Dispatch<React.SetStateAction<'games' | 'groups' | 'saved' | 'account'>>
}
const AccountMenu = ({setRoomCategory}: Props) => {
  const user = useSelector((state: State) => state.user)
  const dispatch = useDispatch()
  const changeUsernameMutation = useMutation({
    mutationFn: updateUsernameCall,
    onSuccess: (data) => {
      const newUserState = {
        logged: true,
        name: data.name,
        email: data.email,
        favoritePlayers: [],
        id: data.id,
        team: data.team
      }
      dispatch(setUser(newUserState))
      localStorage.setItem('token', data.token)
    }
  })
  const changeFavoriteTeamMutation = useMutation({
    mutationFn: updateFavoriteTeamCall,
    onSuccess: (data) => {
      const newUserState = {
        logged: true,
        name: data.name,
        email: data.email,
        favoritePlayers: [],
        id: data.id,
        team: data.team
      }
      dispatch(setUser(newUserState))
      localStorage.setItem('token', data.token)
    }
  })

  const deleteAccountMutation = useMutation({
    mutationFn: deleteAccountCall,
    onSuccess: (data) => {
      console.log(data)
      const newUserState = {
        logged: false,
        name: '',
        email: '',
        favoritePlayers:[],
        id: '',
        team: ''
      }
      dispatch(setUser(newUserState))
      localStorage.removeItem('token')
    }
  })

  const [ showEdit, setShowEdit ] = useState({
    username: false,
    team: false
  })
  const [ newUsername, setNewUsername ] = useState<string>('')
  const [ newFavoriteTeam, setNewFavoriteTeam ] = useState<string>('')
  const [ showLogin, setShowLogin ] = useState<string>('')
    
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewUsername(e.target.value)
  }

  const handleTeamChange = (e: React.ChangeEvent<HTMLSelectElement>) =>{
    setNewFavoriteTeam(e.target.value)
  }
    
    
  const handleClick = () => {   
    if(!isValidString(newUsername)){
      return alert('Please only use alphanumeric characters and !, ? in username')
    }

    if(user.logged && newUsername.length > 2){
      setShowEdit({...showEdit, username: false})
      setNewUsername('')
      console.log('clicked')
      changeUsernameMutation.mutate(newUsername)
    }
  }

  const handleTeamClick = () => {
    if(user.logged && newFavoriteTeam.length > 0){
      setShowEdit({...showEdit, team: false})
      setNewFavoriteTeam('')
      changeFavoriteTeamMutation.mutate(newFavoriteTeam)
    }
  }

  const deleteAccountButton = () => {
    if(user.logged){
      deleteAccountMutation.mutate()
      setRoomCategory('games')
    }
  }

  function isValidString(str:string) {
    const regex = /^[a-zA-Z0-9_!?]*$/
    return regex.test(str)
  }
    
  useEffect(() => {
    if(!user.logged){
      setShowLogin('login')
    }
  },[user.logged])
  return (
    <section className='account-menu-section'>
      {showLogin === 'login' ? <Login onClick={setShowLogin}/> : 
        showLogin === 'register' ? <Registration onClick={setShowLogin}/> :
          <div className='account-menu-box'>
            <div className="account-menu-header">
              <h1 className='account-menu-heading'>Hello, {user.name}!</h1>
              <FontAwesomeIcon icon={faCircleXmark} size='xl' onClick={() => setRoomCategory('games')}/>
            </div>
            <div className='account-menu-detail'>
              <div className='account-menu-item'>
                <label htmlFor="">Email</label>
                <p>{user.email}</p>
              </div>
              <div className='account-menu-item'>
                <label htmlFor="">Username  <span className='edit-button' /* onClick={() => setShowEdit({...showEdit, username: !showEdit.username})} */><FontAwesomeIcon icon={faPenToSquare}/></span></label>
                <AnimatePresence mode='wait' initial={false}>
                  <motion.div
                    initial={{x: 50, opacity: 0}}
                    animate={{x: 0, opacity: 1}}
                    exit={{x: 50, opacity: 0}}
                    transition={{type: 'linear', duration: .1}}
                    key={showEdit.username ? 1 : 0}
                  >
                    {showEdit.username ? 
                      <>
                        <input value={newUsername} type="text" onChange={handleChange} maxLength={20} /> <button type='button' onClick={handleClick}>Confirm</button>
                      </>
                      :
                      <p>{user.name}</p>
                    }
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className='account-menu-item'>
                <label htmlFor="">Favorite Team  <span className='edit-button' onClick={() => setShowEdit({...showEdit, team: !showEdit.team})} ><FontAwesomeIcon icon={faPenToSquare}/></span></label>
                <AnimatePresence mode='wait' initial={false}>
                  <motion.div
                    initial={{x: 50, opacity: 0}}
                    animate={{x: 0, opacity: 1}}
                    exit={{x: 50, opacity: 0}}
                    transition={{type: 'linear', duration: .1}}
                    key={showEdit.team ? 1 : 0}
                  >
                    {showEdit.team ? 
                      <>
                        <select className='favorite-team-selector' name="" id="team" onChange={handleTeamChange} value={newFavoriteTeam}>
                          <option value="" disabled selected>Select your favorite team</option>
                          <option value="109">Arizona Diamonbacks</option>
                          <option value="144">Atlanta Braves</option>
                          <option value="110">Baltimore Orioles</option>
                          <option value="111">Boston Red Sox</option>
                          <option value="145">Chicago White Sox</option>
                          <option value="112">Chicago Cubs</option>
                          <option value="113">Cincinnati Reds</option>
                          <option value="114">Cleveland Guardians</option>
                          <option value="115">Colorado Rockies</option>
                          <option value="116">Detroit Tigers</option>
                          <option value="117">Houston Astros</option>
                          <option value="118">Kansas City Royals</option>
                          <option value="108">Los Angeles Angels</option>
                          <option value="119">Los Angeles Dodgers</option>
                          <option value="146">Miami Marlins</option>
                          <option value="158">Milwaukee Brewers</option>
                          <option value="142">Minnesota Twins</option>
                          <option value="121">New York Mets</option>
                          <option value="147">New York Yankees</option>
                          <option value="133">Oakland Athletics</option>
                          <option value="143">Philadelphia Phillies</option>
                          <option value="134">Pittsburgh Pirates</option>
                          <option value="135">San Diego Padres</option>
                          <option value="137">San Francisco Giants</option>
                          <option value="136">Seattle Mariners</option>
                          <option value="138">St. Louis Cardinals</option>
                          <option value="139">Tampa Bay Rays</option>
                          <option value="140">Texas Rangers</option>
                          <option value="141">Toronto Blue Jays</option>
                          <option value="120">Washington Nationals</option>
                        </select> <button type='button' onClick={handleTeamClick}>Confirm</button>
                      </>
                      : 
                      <p>{teamCodeNames[user.team as keyof unknown]}</p>
                    }
                  </motion.div>
                </AnimatePresence>
              </div>
              <div>
                <button className='delete-account-button' onClick={deleteAccountButton}>Delete Account</button>
              </div>
            </div>
          </div>
      }
    </section>
  )
}

export default AccountMenu
