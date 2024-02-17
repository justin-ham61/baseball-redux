export interface PlayerBase{
    fName: string,
    lName: string,
    fullName: string, 
    playerId: number,
    height: string,
    position: Position,
    weight: number,
    birth: string,
    teamId: number,
    pNumber: number,
    searchValue: string
}

interface Position{
    abbreviation: string,
    code: number, 
    name: string,
    type: string
}

export interface PlayerYearStats extends PlayerBase{

}