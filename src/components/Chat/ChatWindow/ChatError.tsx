import { motion } from 'framer-motion'
interface Props{
  message:string
}
const ChatError = ({message}:Props) => {
  if(!message) return null
  return (
    <motion.div className='error-message'
      initial={{x: 300, opacity: .5}}
      animate={{x:0, opacity: 1}}
      exit={{opacity: 0}}
    >
      <p>{message}</p>
    </motion.div>
  )
}

export default ChatError
