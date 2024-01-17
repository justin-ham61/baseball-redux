import React, { useState } from 'react'
import '@testing-library/jest-dom'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import { render, screen } from '@testing-library/react'
import HeroNav from '../src/components/HeroNav/HeroNav'
import { describe, it } from 'node:test'

const mockStore = configureStore([])
const store = mockStore({
  logged: false,
  name: '',
  email: '',
  id: ''
})

describe('first test', () => {
  it('has corrent button', () => {
    const [ authType, setAuthType ] = useState()
    render(
      <Provider store={store}>
        <HeroNav setAuthType={setAuthType}/>
      </Provider>
    )
    const element = screen.getByText('Sign in')
    expect(element).toBeDefined()
  })
})