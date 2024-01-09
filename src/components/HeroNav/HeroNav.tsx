import * as React from 'react'
import { Dispatch, SetStateAction } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { signOutUser } from '../../util/auth'
import { setUser } from '../../reducers/userReducer'
import { useQueryClient } from '@tanstack/react-query'
import './HeroNav.scss'
import { setLoading } from '../../reducers/loadingReducer'
import { State } from '../../type/stateType'

type Props = {
  setAuthType: Dispatch<SetStateAction<string>>
}

const HeroNav = ({setAuthType}: Props) => {
  const user = useSelector((state:State) => state.user)
  const dispatch = useDispatch()
  const queryClient = useQueryClient()

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.target as HTMLButtonElement
    switch(target.value){
    case 'in':
      setAuthType('login')
      break
    case 'out':{
      dispatch(setLoading(true))
      setTimeout(() => {
        const outUser = signOutUser()
        dispatch(setUser(outUser))
        dispatch(setLoading(false))
        queryClient.invalidateQueries({queryKey:['favoritePlayers']})
      }, 2000)
    }
    }
  }

  if (user !== null) {
    return (
      <div className="nav-bar">
        {!user.logged ? 
          <button onClick={handleClick} value='in'>Sign in</button>
          :
          <>
            <p>Hello, {user.name}!  </p>
            <button onClick={handleClick} value='out'>Sign out</button>
          </>
        }
      </div>
    )
  } else {
    return (
      <></>
    )
  }
}

export default HeroNav
