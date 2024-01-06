import { PlayerBase } from '../../type/PlayerBase'
import './SearchSuggestion.scss'
import { addChoice, setChoice } from '../../reducers/choiceReducer'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Dispatch, SetStateAction } from 'react'
import {logoObject} from '../images/teamlogo/index'
import { State } from '../../type/stateType'

interface Props{
  setSearchField: Dispatch<SetStateAction<string>>
  filteredList: PlayerBase[]
}

const SearchSuggestion = ({setSearchField, filteredList}:Props) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const category = useSelector((state: State)=> state.category)


  const handleClick = (item: PlayerBase) => {
    console.log('clocked')
    switch(category){
    case 'single': 
      dispatch(setChoice(item))
      break
    case 'compare':
      dispatch(addChoice(item))
      break
    case 'favorite':
      break
    }
    setSearchField('')
    navigate('/Chart')
  }
  
  return (
    <>
      <ul className='suggestion'>
        {filteredList.map((item, i) => 
          <li key={i} onClick={() => handleClick(item)}>
            <div className='player'>
              <div>
                <p>{item.fullName}</p>
                <p className='small-info'>{item.position.name} | #{item.pNumber}</p>
              </div>
              <img src={logoObject[item.teamId as keyof unknown]} alt="logo"/>
            </div>
          </li>
        )}
      </ul>
    </>
  )
}

export default SearchSuggestion
