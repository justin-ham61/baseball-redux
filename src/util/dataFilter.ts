import { PlayerBase } from '../type/PlayerBase'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const filterHitters = (players: any) => {
  const newArray:PlayerBase[] = []
  for(let i = 0; i < players.length; i++){
    if(players[i].primaryPosition.code !== '1'){
      const newPlayer:PlayerBase = {
        fName: players[i].firstName,
        lName: players[i].lastName,
        fullName: players[i].fullName,
        playerId: Number(players[i].id),
        height: players[i].height,
        position: players[i].primaryPosition,
        weight: players[i].weight,
        birth: players[i].birthDate,
        teamId: players[i].currentTeam.id,
        pNumber: Number(players[i].primaryNumber)
      }
      newArray.push(newPlayer)
    }
  }
  return newArray
}