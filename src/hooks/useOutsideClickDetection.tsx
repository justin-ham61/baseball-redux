/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react'
import { SetStateAction, useEffect} from 'react'

export function useOutsideClickDetection (ref: React.RefObject<HTMLDivElement>, authType: string, setAuthType: React.Dispatch<SetStateAction<string>>) {
  useEffect(() => {
    function handleClickOutside(event: any) {
      if(authType === ''){
        return
      }
      if(event.target === ref.current){
        setAuthType('')
      }
    }
      
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref, authType, setAuthType])
}