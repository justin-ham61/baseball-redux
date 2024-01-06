import 'ldrs/ring2'
import { ring2,quantum,ring } from 'ldrs'
import './Loading.scss'
const Loading = () => {
  ring2.register()
  quantum.register()
  ring.register()
  // Default values shown
  return (
    <>
      {/*       <l-ring-2
        size="40"
        stroke="5"
        stroke-length="0.25"
        bg-opacity="0.1"
        speed="0.8" 
        color="black" 
        ></l-ring-2>
      <l-quantum
        size="45"
        speed="1.75" 
        color="black" 
      ></l-quantum> */}

      <l-ring
        size="40"
        stroke="5"
        bg-opacity="0"
        speed="3" 
        color="black" 
      ></l-ring>
    </>
  )
}

export default Loading
