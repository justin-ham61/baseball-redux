
import {useRef, useState, useEffect} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown} from '@fortawesome/free-solid-svg-icons'
import { AnimatePresence,motion } from 'framer-motion'
import './OnePlayerChartOptions.scss'
import * as React from 'react'

interface Props{
    setSeason:React.Dispatch<React.SetStateAction<string>>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    currentPlayerCareerStats:any[],
    season: string,
    chartOption:{chartOptionCategory:string, setChartOptionCategory:React.Dispatch<React.SetStateAction<string>>}
    checkboxState:{checkbox: string[], setCheckbox:React.Dispatch<React.SetStateAction<string[]>>}
}

const OnePlayerChartOptions = ({setSeason, currentPlayerCareerStats, season, chartOption, checkboxState}:Props) => {
  const [ collapsed, setCollapsed ] = useState(true)
  const [ optionHeight, setOptionHeight ] = useState<number>(0)
  const optionRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef(null)

  const optionVariants = {
    hidden: { opacity: 0, y: -50, transition:{delay: 0, type: 'tween', duration: .2}},
    visible: { opacity: 1, y: -50, transition:{delay: .2, type: 'tween', duration: .2}}
  }

  const buttonVariants = {
    hidden: { y: 0,
      transition: {
        type: 'tween', // Specifies a linear, time-based transition
        duration: 0.2, // Adjust the duration as needed
      }
    },
    visible: { y: optionHeight + 10,
      transition: {
        type: 'tween', // Specifies a linear, time-based transition
        duration: 0.2 // Adjust the duration as needed
      }
    }
    
  }


  const handleChange = (e:React.ChangeEvent<HTMLSelectElement>) => {
    const year = e.target.value
    setSeason(year)
  }

  const handleCheckboxChange = (e:React.ChangeEvent<HTMLFormElement>) => {
    if(checkboxState.checkbox.indexOf(e.target.value) === -1){
      checkboxState.setCheckbox([...checkboxState.checkbox, e.target.value])
    } else if (checkboxState.checkbox.indexOf(e.target.value) >= 0){
      const newItem:string[] = checkboxState.checkbox.filter(item => item !== e.target.value)
      checkboxState.setCheckbox(newItem)
    }
  }

  useEffect(() => {
    if (optionRef.current) {
      setOptionHeight(optionRef.current.offsetHeight)
    }
  }, [collapsed, chartOption.chartOptionCategory])

  return (
    <>
      <motion.div className='chart-option-selector-collapsed' onClick={() => setCollapsed(!collapsed)}
        variants={buttonVariants}
        animate={collapsed ? 'hidden' : 'visible'}
        ref={buttonRef}
      >
        <p>Configure Chart</p>
        <motion.span
          initial={{ rotate: 0 }}
          animate={{ rotate: !collapsed ? 180 :  0}}
          transition={{
            duration: .3
          }}
        ><FontAwesomeIcon icon={faAngleDown}/></motion.span>
      </motion.div>
      <AnimatePresence>
        <motion.div className='chart-option-selector'
          ref={optionRef}
          initial='hidden'
          animate={collapsed ? 'hidden' : 'visible'}
          variants={optionVariants}
          style={{ display: collapsed ? 'none' : 'flex' }}
          exit='hidden'
          key='option'
        >
          <div className='chart-option-main-option'>
            <select name="" id="" value={season} onChange={handleChange}>
              {currentPlayerCareerStats.map((split, i) => {
                if(split.team){
                  return(
                    <option key={i} value={split.season}>{split.season}</option>
                  )
                }
              })}
            </select>
            <table className='type-selector-table'>
              <tr className='type-selector'>
                <td className={chartOption.chartOptionCategory === 'avg' ? 'type left active' : 'type left'} onClick={() => chartOption.setChartOptionCategory('avg')}>Average</td>
                <td className={chartOption.chartOptionCategory === 'agg' ? 'type right active' : 'type right'} onClick={() => chartOption.setChartOptionCategory('agg')}>Aggregate</td>
              </tr>
            </table>

          </div>
          {chartOption.chartOptionCategory === 'agg' ? 
            <form action="" onChange={handleCheckboxChange} className='checkboxes'>
              <label htmlFor="">Hits</label>
              <input type="checkbox" value='hits' checked={checkboxState.checkbox.indexOf('hits') >= 0}/>
              <label htmlFor="">Doubles</label>
              <input type="checkbox" value='doubles' checked={checkboxState.checkbox.indexOf('doubles') >= 0}/>
              <label htmlFor="">Triples</label>
              <input type="checkbox" value='triples' checked={checkboxState.checkbox.indexOf('triples') >= 0} />
              <label htmlFor="">Home Runs</label>
              <input type="checkbox" value='homeRuns' checked={checkboxState.checkbox.indexOf('homeRuns') >= 0} />
              <label htmlFor="">RBI</label>
              <input type="checkbox" value='rbi' checked={checkboxState.checkbox.indexOf('rbi') >= 0} />
              <label htmlFor="">Runs</label>
              <input type="checkbox" value='runs' checked={checkboxState.checkbox.indexOf('runs') >= 0}/>
              <label htmlFor="">Stolen Bases</label>
              <input type="checkbox" value='stolenBases' checked={checkboxState.checkbox.indexOf('stolenBases') >= 0}/>
              <label htmlFor="">Strike Outs</label>
              <input type="checkbox" value='strikeOuts' checked={checkboxState.checkbox.indexOf('strikeOuts') >= 0}/>
              <label htmlFor="">Walks</label>
              <input type="checkbox" value='baseOnBalls' checked={checkboxState.checkbox.indexOf('baseOnBalls') >= 0} />
              <label htmlFor="">Intentional Walks</label>
              <input type="checkbox" value='intentionalWalks' checked={checkboxState.checkbox.indexOf('intentionalWalks') >= 0} />
              <label htmlFor="">At Bats</label>
              <input type="checkbox" value='atBats' checked={checkboxState.checkbox.indexOf('atBats') >= 0} />
            </form>
            : null
          }
        </motion.div>
      </AnimatePresence>
    </>
  )
}


export default OnePlayerChartOptions
