const axios = require('axios')
const chatroomModel = require('../database/Chat/chatroomSchema')
var todaysRooms = null

const gamedate = process.env.GAMEDATE

const fetchChatRooms = async () => {
  try {
    const response = await axios.get(`https://bdfed.stitch.mlbinfra.com/bdfed/transform-mlb-schedule?stitch_env=prod&sortTemplate=5&sportId=1&&sportId=51&&sportId=21&startDate=${gamedate}&endDate=${gamedate}&gameType=E&&gameType=S&&gameType=R&&gameType=F&&gameType=D&&gameType=L&&gameType=W&&gameType=A&language=en&leagueId=104&&leagueId=103&&leagueId=160&&leagueId=590&contextTeamId=`)
    todaysRooms = response.data.dates[0].games
    todaysRooms.map( async (room) => {
      const existingRoom = await chatroomModel.find({roomId: room.gameGuid})
      if(existingRoom.length === 0){
        const teams = room.teams.home.team.clubName + ' vs ' + room.teams.away.team.clubName
        const newRoom = new chatroomModel({
          roomId: room.gameGuid,
          roomDate: new Date(room.gameDate), 
          teams: teams,
          gamePk: room.gamePk
        })
        await newRoom.save()
        console.log('Saved ' + room.gamePk + ' in Database')
      } else {
        /*         console.log(room.gamePk + ' already exists') */
      }
    })
  } catch (error){
    console.log('Error while fetching games', error)
  }
}

module.exports = {
  fetchChatRooms,
  getChatRooms: () => todaysRooms,
  gamedate
}