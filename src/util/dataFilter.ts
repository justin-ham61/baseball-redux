import { PlayerBase } from '../type/PlayerBase'
const teamIdtoName = {
  '109': 'Arizona Diamonbacks',
  '144': 'Atlanta Braves',
  '110': 'Baltimore Orioles',
  '111': 'Boston Red Sox',
  '145': 'Chicago White Sox',
  '112': 'Chicago Cubs',
  '113': 'Cincinnati Reds',
  '114': 'Cleveland Guardians',
  '115': 'Colorado Rockies',
  '116': 'Detroit Tigers',
  '117': 'Houston Astros',
  '118': 'Kansas City Royals',
  '108': 'Los Angeles Angels',
  '119': 'Los Angeles Dodgers',
  '146': 'Miami Marlins',
  '158': 'Milwaukee Brewers',
  '142': 'Minnesota Twins',
  '121': 'New York Mets',
  '147': 'New York Yankees',
  '133': 'Oakland Athletics',
  '143': 'Philadelphia Phillies',
  '134': 'Pittsburgh Pirates',
  '135': 'San Diego Padres',
  '137': 'San Francisco Giants',
  '136': 'Seattle Mariners',
  '138': 'St. Louis Cardinals',
  '139': 'Tampa Bay Rays',
  '140': 'Texas Rangers',
  '141': 'Toronto Blue Jays',
  '120': 'Washington Nationals',
}
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
        pNumber: Number(players[i].primaryNumber),
        searchValue: `${players[i].fullName} ${teamIdtoName[players[i].currentTeam.id as keyof unknown]} ${players[i].primaryPosition.name} ${players[i].primaryPosition.type}`
      }
      newArray.push(newPlayer)
    }
  }
  return newArray
}