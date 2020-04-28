import { Coordinate } from 'ol/coordinate';
import * as moment from 'moment';
import 'moment-duration-format';

export interface MostWanted {
    lat: number;
    lng: number;
    title: string;
    held_length: number;
}

export interface MostWantedTableData {
    coord: Coordinate;
    title: string;
    held_length: string;
}

export class MostWantedTableDataFactory {
    constructor(
        private mostWanted: MostWanted
    ) { }

    public toMostWantedTableData(): MostWantedTableData {
        const coord: Coordinate = [this.mostWanted.lat, this.mostWanted.lng];
        const held_moment = moment.duration(this.mostWanted.held_length, 'seconds');
        const held_format = held_moment.format('d [days], h [hours], mm:ss [minutes]');

        return {
            coord,
            title: this.mostWanted.title,
            held_length: held_format,
        } as MostWantedTableData;
    }
}
