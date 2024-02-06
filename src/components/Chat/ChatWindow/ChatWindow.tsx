/* eslint-disable @typescript-eslint/no-explicit-any */

import * as React from 'react'
import { useEffect, useRef, useState } from 'react'
import './ChatWindow.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import io,{Socket} from 'socket.io-client'
import { useSelector } from 'react-redux'
import { State } from '../../../type/stateType'
import {logoObject} from '../../images/teamlogo/index'
import { useNavigate, useParams } from 'react-router-dom'
import ChatError from './ChatError'
import { AnimatePresence } from 'framer-motion'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addSavedRoomCall } from '../../../util/query'
import { faBookmark as filledBookmark } from '@fortawesome/free-solid-svg-icons'
import { faBookmark as emptyBookmark } from '@fortawesome/free-regular-svg-icons'
import Loading from '../../Loading/Loading'



interface Props {
  roomId: string | null,
   
  selectedRoom: any,
  gameData: any,
  savedRooms: string[]
}

interface Message{
  _id: string,
  userId: string,
  roomId: string,
  message: string,
  timestamp: Date,
  userTeam: string
}

const ChatWindow = ({selectedRoom, gameData, savedRooms}: Props) => {
  const queryClient = useQueryClient()
  const savedRoomQueryState = queryClient.getQueryState(['savedChats'])
  const navigate = useNavigate()
  const { roomIdParam } = useParams()
  const user = useSelector((state:State) => state.user)
  const [ errorMessage, setErrorMessage ] = useState<string>('')
  const [ messages, setMessages ] = useState<Message[]>([])
  const [ scrollBehavior, setScrollBehavior ] = useState<ScrollBehavior>('auto')
  const [ messageContent, setMessageContent ] = useState<string>('')  
  const [ socket, setSocket ] = useState<Socket | null>(null)
  const bottomScrollRef = useRef<HTMLDivElement>(null)
  const maxLength: number = 100
  const currentUser:string = user.name
  const currentUserTeam:string = user.team
  const newSavedRoom = useMutation({
    mutationFn: addSavedRoomCall,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['savedChats']})
    }
  })

  const handleBookmarkClick = () => {
    if(user.logged){
      newSavedRoom.mutate(selectedRoom.gameGuid)
    } else {
      alert('You must be signed in to select favorite players')
    }
  }

  useEffect(() => {
    const newSocket = io('http://localhost:3001')

    setSocket(newSocket)

    newSocket.emit('join room', roomIdParam)

    newSocket.on('chat message', (msg) => {
      console.log('received')
      setMessages((prevMessages) => [...prevMessages, msg])
    })

    newSocket.on('toxic', (message) => {
      if(errorMessage !== message){
        setErrorMessage(message)
        setTimeout(() => {
          setErrorMessage('')
        }, 4000)
      }
    })

    newSocket.on('rate_limit', (message) => {
      if(errorMessage !== message){
        setErrorMessage(message)
        setTimeout(() => {
          setErrorMessage('')
        },4000)
      }
    })

    newSocket.on('chat history', (messages) => {
      setMessages(messages)
    })
    
    newSocket.on('error message', (message) => {
      console.log(message)
    })

    setTimeout(() => {
      setScrollBehavior('smooth')
    }, 2000)

    return () => {
      newSocket.disconnect()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const scrollToBottom = () => {
      bottomScrollRef.current?.scrollIntoView({ behavior: scrollBehavior, block: 'end', inline: 'nearest'  })
    }
    scrollToBottom()
  }, [messages, scrollBehavior])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageContent(e.target.value)
  }

  const sendMessage = () => {
    sendMessageCall()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === 'Enter'){
      sendMessageCall()
    }
  }

  const sendMessageCall = () => {
    if(!user.logged){
      if(errorMessage !== 'You must be logged in to send messages'){
        setErrorMessage('You must be logged in to send messages')
        setTimeout(() => {
          setErrorMessage('')
        },4000)
      }
    }
    if(messageContent.length > 0 && socket && user.logged){
      setMessageContent('')
      socket.emit('chat message', {room: selectedRoom.gameGuid, msg: messageContent, userId: currentUser, userTeam: currentUserTeam})
    }
  }
  
  const handlePlayerClick = (id: string) => {
    navigate(`/Chart/${id}`)
  }

  return (
    <div className='chat-window'>
      <AnimatePresence>
        <ChatError key={errorMessage} message={errorMessage}/>
      </AnimatePresence>
      <div className="chat-window-header">
        <div className='header-vs'>
          <img src={logoObject[selectedRoom.teams.home.team.id as keyof unknown]} alt={selectedRoom.teams.home.team.name} />
          <h1>{selectedRoom.teams.home.team.abbreviation}</h1>
          <h1> | </h1>
          <h1>{selectedRoom.teams.away.team.abbreviation}</h1>
          <img src={logoObject[selectedRoom.teams.away.team.id as keyof unknown]} alt={selectedRoom.teams.away.team.name} />
          {newSavedRoom.isPending || savedRoomQueryState?.fetchStatus === 'fetching' ? <Loading/> : null}
          {!newSavedRoom.isPending && savedRoomQueryState?.fetchStatus !== 'fetching' && 
          (
            savedRooms?.indexOf(selectedRoom.gameGuid) === -1 ? 
              <FontAwesomeIcon icon={emptyBookmark} onClick={handleBookmarkClick}/> :
              <FontAwesomeIcon icon={filledBookmark} onClick={handleBookmarkClick}/>
          )}
        </div>
      </div>
      {gameData.liveData.linescore.defense.pitcher && 
      <div className='current-players'>
        <div className='current-pitcher player-card'>
          <img className='player-img' src={`https://content.mlb.com/images/headshots/current/60x60/${gameData.liveData.linescore.defense.pitcher.id}@2x.png`} alt="" />
          <div className='player-description'>
            <p className='player-status'>Pitching</p>
            <p className='live-player-info'>{gameData.liveData.linescore.defense.pitcher.fullName} | #{gameData.gameData.players['ID' + gameData.liveData.linescore.defense.pitcher.id].primaryNumber} {gameData.gameData.players['ID' + gameData.liveData.linescore.defense.pitcher.id].primaryPosition.abbreviation}</p>
          </div>
        </div>
        <div className='at-bat player-card' onClick={() => handlePlayerClick(gameData.liveData.linescore.offense.batter.id)}>
          <img className='player-img'  src={`https://content.mlb.com/images/headshots/current/60x60/${gameData.liveData.linescore.offense.batter.id}@2x.png`} alt="" />
          <div className='player-description'>
            <p className='player-status'>Batting</p>
            <p className='live-player-info'>{gameData.liveData.linescore.offense.batter.fullName} | #{gameData.gameData.players['ID' + gameData.liveData.linescore.offense.batter.id].primaryNumber} {gameData.gameData.players['ID' + gameData.liveData.linescore.offense.batter.id].primaryPosition.abbreviation}</p>
          </div>
        </div>
        <div className="on-deck player-card" onClick={() => handlePlayerClick(gameData.liveData.linescore.offense.onDeck.id)}>
          <img className='player-img' src={`https://content.mlb.com/images/headshots/current/60x60/${gameData.liveData.linescore.offense.onDeck.id}@2x.png`} alt="" />
          <div className='player-description'>
            <p className='player-status'>On Deck</p>
            <p className='live-player-info'>{gameData.liveData.linescore.offense.onDeck.fullName}</p>
          </div>
        </div>
        <div className='in-hole player-card' onClick={() => handlePlayerClick(gameData.liveData.linescore.offense.inHole.id)}>
          <img className='player-img' src={`https://content.mlb.com/images/headshots/current/60x60/${gameData.liveData.linescore.offense.inHole.id}@2x.png`} alt="" />
          <div className='player-description'>
            <p className='player-status'>In Hole</p>
            <p className='live-player-info'>{gameData.liveData.linescore.offense.inHole.fullName}</p>
          </div>
        </div>
      </div>
      }
      <div className='chat-message-section'>
        <div className='bottom-scroller'></div>
        {messages.map((message,i) => {
          return(
            <div className='message-bar' key={i}>
              <div className='message-user-info'>
                <p className='message-user-name'>{message.userId}</p>
                <img className='message-user-team' src={logoObject[message.userTeam as keyof unknown]} alt="" />
              </div>
              <div className='message-bubble'>
                <p className='message'>{message.message}</p>
              </div>
            </div>
          )
        })}
        <div ref={bottomScrollRef} />
      </div>
      <div className='chat-input-section'>
        <div className='input-bar-section'>
          <input className='chat-input-bar' type="text" onChange={handleChange} value={messageContent} maxLength={100} onKeyDown={handleKeyDown}/>
          <div className='character-counter'>
            <p>{messageContent.length}/{maxLength}</p>
          </div>
        </div>
        <div className='send-button-section'>
          <FontAwesomeIcon icon={faPaperPlane} onClick={sendMessage}/>
        </div>
      </div>
    </div>
  )
}

export default ChatWindow
