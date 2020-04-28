export interface NeighborhoodHour {
    hour: number;
    destroyed: number; // boolean
    action_count: number;
}

export class NeighborhoodHourlyDataFactory {
    constructor(
        private neighborhoodHours: NeighborhoodHour[],
    ) { }

    toNeighborhoodHourlyData() {
        const resonatorsBuilt = this.neighborhoodHours.filter(hour => {
            return hour.destroyed === 0;
        });
        const resonatorsDestroyed = this.neighborhoodHours.filter(hour => {
            return hour.destroyed === 1;
        });
        return {
            built: resonatorsBuilt.map(hour => hour.action_count),
            destroyed: resonatorsDestroyed.map(hour => hour.action_count)
        };
    }
}
