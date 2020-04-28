
export interface NeighborhoodPlayer {
    name: string;
    built_count: number;
    destroyed_count: number;
}

export class NeighborhoodPlayerDataFactory {
    constructor(
        private neighborhoodPlayers: NeighborhoodPlayer[]
    ) { }

    toNeighborhoodPlayerData () {
        return {
            built: this.neighborhoodPlayers.map(player => {return player.built_count;}),
            destroyed: this.neighborhoodPlayers.map(player => {return player.destroyed_count;}),
            playerNames: this.neighborhoodPlayers.map(player => {return player.name;})
        }
    }
}