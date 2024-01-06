import { PlayerBase } from './PlayerBase'

export interface State {
    category: string,
    choice: PlayerBase[],
    loading: boolean,
    player: PlayerBase[],
    user: {
        email: string,
        favoritePlayers: number[],
        id: string,
        logged: boolean, 
        name: string
    }
}