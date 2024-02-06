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
    captcha:'',
    team: ''
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

  const handleTeamChange = (e: React.ChangeEvent<HTMLSelectElement>):void => {
    const team = e.target.value
    setForm({...form, team: team})
    console.log(form)
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
        <input id='name' type="text" placeholder='Username' onChange={handleChange} value={form.name} required/>
        <input id='password' type="password" placeholder="Password" minLength={8} onChange={handleChange} value={form.password} required/>
        <select className='favorite-team-selector' name="" id="team" onChange={handleTeamChange} value={form.team}>
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
        </select>
        <ReCAPTCHA sitekey='6LcJSSYpAAAAAEncYCQa3abX7aKpWWRslSc6OY8v' onChange={handleCaptcha}/>
        <button>Register</button>
        <p onClick={() => onClick('login')}>Already have an account? Sign in</p>
      </form>
    </>
  )
}

export default Registration
