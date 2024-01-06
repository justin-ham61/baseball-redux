import './ChartHeader.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useSelector } from 'react-redux'
import { faStar as fullStar } from '@fortawesome/free-solid-svg-icons'
import { faStar as emptyStar } from '@fortawesome/free-regular-svg-icons'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addFavoritePlayerCall } from '../../util/query'
import Loading from '../Loading/Loading'
import { PlayerBase } from '../../type/PlayerBase'
import { State } from '../../type/stateType'

interface Props {
    season: string,
    currentPlayer: PlayerBase
}

const ChartHeader = ( {season, currentPlayer}:Props ) => {

  const user = useSelector((state: State) => state.user)
  const queryClient = useQueryClient()
  const favoriteQueryState = queryClient.getQueryState(['favoritePlayers'])

  console.log(favoriteQueryState)

  const newFavoriteMutation = useMutation({
    mutationFn: addFavoritePlayerCall,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:['favoritePlayers']})
    }
  })


  const handleStarClick = () => {
    if(user.logged){
      newFavoriteMutation.mutate(currentPlayer.playerId)
    } else {
      alert('You must be signed in to select favorite players')
    }
  }


  return (
    <div className='chart-header'>
      <div className='left-header'>
        <div>
          <h2>{currentPlayer.fullName}</h2>
          <p>{season} Season</p>
        </div>
        {
          newFavoriteMutation.isPending || favoriteQueryState?.fetchStatus === 'fetching' ?
            <Loading /> :
            null
        }
        {
          !newFavoriteMutation.isPending && favoriteQueryState?.fetchStatus !== 'fetching' ?
            (
              user.favoritePlayers.indexOf(currentPlayer.playerId) === -1 ? 
                <FontAwesomeIcon icon={emptyStar} size='2xl' className='empty' onClick={handleStarClick}/> :
                <FontAwesomeIcon icon={fullStar} size='2xl' className='filled' onClick={handleStarClick}/>
            )
            :
            null
        }
      </div>
      <div className='right-header'>
      </div>
    </div>
  )
}

export default ChartHeader
