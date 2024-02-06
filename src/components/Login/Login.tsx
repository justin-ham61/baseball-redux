import ReCAPTCHA from 'react-google-recaptcha'
import { useState, Dispatch, SetStateAction } from 'react'
import {loginUser} from '../../util/auth'
import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '../../reducers/userReducer'
import { setLoading } from '../../reducers/loadingReducer'
import { useQueryClient } from '@tanstack/react-query'
import { State } from '../../type/stateType'
import './Login.scss'

interface Form{
    email:string
    password:string
    captcha: string|null
}

interface Props{
    onClick: Dispatch<SetStateAction<string>>
}

interface LoginReturnData{
  logged: boolean,
  email:string,
  name:string,
  id:string
}

const Login = ( {onClick}: Props ) => {
  const dispatch = useDispatch()
  const loading = useSelector((state:State) => state.loading)
  const queryClient = useQueryClient()
  const [form, setForm] = useState<Form>({
    email: '',
    password:'',
    captcha:''
  })


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const category:string = e.target.id
    switch(category){
    case 'email':
      setForm({...form, email: e.target.value})
      break
    case 'password':
      setForm({...form, password: e.target.value})
      break
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if(!form.captcha){
      alert('Please complete reCAPTCHA')
      return
    }
    
    try{
      dispatch(setLoading(true))
      const result:LoginReturnData = await loginUser(form)
      dispatch(setUser(result))
      onClick('')
      queryClient.invalidateQueries({queryKey:['favoritePlayers']})
      dispatch(setLoading(false))
    } catch (error){
      alert('There was an error while signing in')
      dispatch(setLoading(false))
      console.log(error)
    }
  }

  const handleCaptcha = (token: string | null) => {
    setForm({...form, captcha: token})
  }

  const handleGuestLogin = () => {
    setForm({
      ...form,
      email: 'guestaccount@mlbchart.com',
      password: 'guest1234'
    })
  }

  return (
    <>
      {!loading ? 
        <form action="" className='registration-form' onSubmit={handleSubmit}>
          <h2>Login</h2>
          <input id='email' type="email" placeholder="Email" onChange={handleChange} value={form.email}/>
          <input id='password' type="password" placeholder="Password" minLength={8} onChange={handleChange} value={form.password}/>
          <ReCAPTCHA sitekey='6LcJSSYpAAAAAEncYCQa3abX7aKpWWRslSc6OY8v' onChange={handleCaptcha}/>
          <div className='button-bar'>
            <button onClick={handleGuestLogin} type='button'>Guest Login</button>
            <button type='submit'>Login</button>
          </div>
          <p onClick={() => onClick('register')}>Don't have an account? Register!</p>
        </form>
        :
        null}
    </>
  )
}

export default Login
