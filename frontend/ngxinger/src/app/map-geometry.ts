import { Feature, Collection } from 'ol';
import { Coordinate } from 'ol/coordinate';
import { Style, Icon, Stroke, Fill } from 'ol/style';
import { Point, LineString, Polygon } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';

import { Constants } from './constants';
import GeometryLayout from 'ol/geom/GeometryLayout';

export interface Portal {
    coord: Coordinate;
    level: number;
}

export interface Portals {
    team: number;
    portals: Portal[];
}

export interface VecGeom {
    team: number;
    geoms: Coordinate[];
}

export interface MapGeometry {
    portals: Portals[];
    links: VecGeom[];
    fields: VecGeom[];
}

export class OLLayerFactory {
    private portalStyles: any;
    private vecStyles: any;

    constructor(
        private mapGeometry: MapGeometry,
    ){
        this.portalStyles = {};
        // XXX had trouble getting let..of to work on enums, then arrays, so these are all literals
        for (const team of [0, 1, 2]) {
          this.portalStyles[team] = {};
          for (const level of [1, 2, 3, 4, 5, 6, 7, 8]) {
            if (team === 0 && !(level === 1)) {
              continue;
            }
            this.portalStyles[team][level] = new Style({
              image: new Icon({
                src: `/assets/images/${team}/${level}.png`
              })
            });
          }
        }

        this.vecStyles = {
            1: new Style({
                fill: new Fill({
                    color: 'rgba(0, 255, 0, 0.2)',
                }),
                stroke: new Stroke({
                    color: 'rgba(0, 255, 0, 0.5)',
                    width: 2,
                })
            }),
            2: new Style({
                fill: new Fill({
                    color: 'rgba(0, 0, 255, 0.2)'
                }),
                stroke: new Stroke({
                    color: 'rgba(0, 0, 255, 0.5)',
                    width: 2,
                })
            }),
        };
    }

    toPortalLayer(): Collection<VectorLayer> {
        const olPortalLayers: VectorLayer[] = this.mapGeometry.portals.map(teamPortals => {
            const portalFeatures = teamPortals.portals.map(portal => {
                const feature = new Feature(new Point(portal.coord));
                feature.setStyle(this.portalStyles[teamPortals.team][portal.level]);
                return feature;
            });
            const teamPortalLayer = new VectorLayer({
                source: new VectorSource({
                    features: portalFeatures,
                })
            });
            teamPortalLayer.set('title', Constants.TeamNames[teamPortals.team]);
            teamPortalLayer.set('fold', 'open');
            return teamPortalLayer;
        });
        return new Collection(olPortalLayers);
    }

    private _toVecLayer<T>(
        teamGeoms: VecGeom[],
        featureType: new(Coordinate, GeometryLayout) => T
        ): Collection<VectorLayer> {
        const olLayers: VectorLayer[] = teamGeoms.map(teamGeom => {
            const geomFeatures = teamGeom.geoms.map(vertex => {
                return new Feature(new featureType(vertex, GeometryLayout.XY));
            });
            const teamLayer = new VectorLayer({
                source: new VectorSource({
                    features: geomFeatures,
                })
            });
            teamLayer.set('title', Constants.TeamNames[teamGeom.team]);
            teamLayer.set('fold', 'open');
            teamLayer.setStyle(this.vecStyles[teamGeom.team]);
            return teamLayer;
        });
        return new Collection(olLayers);
    }

    toLinkLayer(): Collection<VectorLayer> {
        return this._toVecLayer(this.mapGeometry.links, LineString);
    }

    toFieldLayer(): Collection<VectorLayer> {
        return this._toVecLayer(this.mapGeometry.fields, Polygon);
    }
}
