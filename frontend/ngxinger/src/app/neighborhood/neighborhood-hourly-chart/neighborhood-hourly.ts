export interface NeighborhoodHour {
    hour: number;
    destroyed: number; // boolean
    action_count: number;
};

export class NeighborhoodHourlyDataFactory {
    constructor(
        private neighborhoodHours: NeighborhoodHour[],
    ) { }

    toNeighborhoodHourlyData() {
        let resonatorsBuilt = this.neighborhoodHours.filter(hour => {
            return hour.destroyed === 0;
        });
        let resonatorsDestroyed = this.neighborhoodHours.filter(hour => {
            return hour.destroyed === 1;
        });
        return {
            built: resonatorsBuilt.map(hour => {return hour.action_count;}),
            destroyed: resonatorsDestroyed.map(hour => {return hour.action_count;})
        }
    }
}