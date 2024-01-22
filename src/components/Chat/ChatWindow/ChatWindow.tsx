import * as React from 'react'
import { useEffect, useRef, useState } from 'react'
import './ChatWindow.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import io,{Socket} from 'socket.io-client'
import { useSelector } from 'react-redux'
import { State } from '../../../type/stateType'

interface Props {
  roomId: string | null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectedRoom: any
}
interface Message{
  _id: string,
  userId: string,
  roomId: string,
  message: string,
  timestamp: Date
}

const ChatWindow = ({roomId, selectedRoom}: Props) => {
  const user = useSelector((state:State) => state.user)
  const [ messages, setMessages ] = useState<Message[]>([])
  const [ scrollBehavior, setScrollBehavior ] = useState<ScrollBehavior>('auto')
  const [ messageContent, setMessageContent ] = useState<string>('')  
  const [ socket, setSocket ] = useState<Socket | null>(null)
  const bottomScrollRef = useRef<HTMLDivElement>(null)
  const maxLength: number = 100
  const currentUser = user.name
  useEffect(() => {
    const newSocket = io('http://localhost:3001')

    setSocket(newSocket)

    newSocket.emit('join room', roomId)

    newSocket.on('chat message', (msg) => {
      console.log('received')
      setMessages((prevMessages) => [...prevMessages, msg])
    })

    newSocket.on('chat history', (messages) => {
      console.log(messages)
      setMessages(messages)
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
      alert('You must be logged in to send messages')
    }
    if(messageContent.length > 0 && socket && user.logged){
      setMessageContent('')
      socket.emit('chat message', {room: roomId, msg: messageContent, userId: currentUser})
    }
  }

  return (
    <div className='chat-window'>
      <div className="chat-window-header">
        <h1>{selectedRoom.teams.home.team.teamName} : {selectedRoom.teams.away.team.teamName}</h1>
      </div>
      <div className='chat-message-section'>
        <div className='bottom-scroller'></div>
        {messages.map((message,i) => {
          return(
            <div className='message-bar' key={i}>
              <p className='message-user'>{message.userId}</p>
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
