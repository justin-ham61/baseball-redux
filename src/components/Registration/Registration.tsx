import ReCAPTCHA from 'react-google-recaptcha'
import { useState} from 'react'
import { registerNewUser } from '../../util/auth'
import {Form, Props} from './types'
import './Registration.scss'
import * as React from 'react'
import { useDispatch } from 'react-redux'
import { setLoading } from '../../reducers/loadingReducer'

const Registration = ({onClick}: Props) => {
  const dispatch = useDispatch()
  const [ form, setForm ] = useState<Form>({
    email:'',
    name:'',
    password:'',
    captcha:''
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCaptcha = (value: any) => {
    setForm({...form, captcha: value})
  }  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const category: string = e.target.id
    switch(category){
    case 'email':
      setForm({...form, email: e.target.value})
      break
    case 'name':
      setForm({...form, name: e.target.value})
      break
    case 'password':
      setForm({...form, password: e.target.value})
      break
    }
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    if(form.captcha){
      dispatch(setLoading(true))
      setTimeout(async () => {
        const result = await registerNewUser(form)
        if(result){
          console.log(result)
          onClick('login')
          dispatch(setLoading(false))
        }
      }, 2000)
    } else {
      alert('Please complete the reCAPTCHA')
    }
  }

  return (
    <>
      <form action="" className='registration-form' onSubmit={handleSubmit}>
        <h2>Registration</h2>
        <input id='email' type="email" placeholder="Email" onChange={handleChange} value={form.email} required/>
        <input id='name' type="text" placeholder='Name' onChange={handleChange} value={form.name} required/>
        <input id='password' type="password" placeholder="Password" minLength={8} onChange={handleChange} value={form.password} required/>
        <ReCAPTCHA sitekey='6LcJSSYpAAAAAEncYCQa3abX7aKpWWRslSc6OY8v' onChange={handleCaptcha}/>
        <button>Register</button>
        <p onClick={() => onClick('login')}>Already have an account? Sign in</p>
      </form>
    </>
  )
}

export default Registration
