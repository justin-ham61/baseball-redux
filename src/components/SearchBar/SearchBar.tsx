import * as React from 'react'
import './SearchBar.scss'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { PlayerBase } from '../../type/PlayerBase'
import SearchSuggestion from '../SearchSuggestion/SearchSuggestion'
import { State } from '../../type/stateType'


const SearchBar = () => {
  const [searchField, setSearchField] = useState<string>('')
  const [filteredList, setFilteredList] = useState<Array<PlayerBase>>([])
  const players = useSelector((state: State) => state.player)

  useEffect(() => {
    if(searchField.length >= 1){
      const filter = players.filter((player:PlayerBase) => {  
        return player.fullName.toLowerCase().includes(searchField.toLowerCase())
      })
      setFilteredList(filter)
    } else {
      setFilteredList([])
      setSearchField('')
    }
  },[players, searchField])

  useEffect(() => {
    console.log(filteredList)
  },[filteredList])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const search: string = e.target.value
    setSearchField(search)
  }

  return (
    <>
      <input className={searchField.length === 0 ? 'empty' : 'filled'} type="text" onChange={handleChange} value={searchField} placeholder="Search for Players"/>
      <SearchSuggestion filteredList={filteredList} setSearchField={setSearchField}/>
    </>
  )
}

export default SearchBar
