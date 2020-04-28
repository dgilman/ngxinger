import { Component, OnInit } from '@angular/core';

import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Group } from 'ol/layer';
import { fromLonLat } from 'ol/proj';
import { Style, Icon } from 'ol/style';

import { Constants } from '../../constants';
import { MapGeometry, OLLayerFactory } from '../../map-geometry';
import { NeighborhoodSelect } from '../neighborhood-select';
import { NeighborhoodSelectService } from '../neighborhood-select.service';
import { MapGeometryService } from '../../map-geometry.service';
import VectorLayer from 'ol/layer/Vector';
import { Draw } from 'ol/interaction';
import { DrawEvent } from 'ol/interaction/Draw';
import { Polygon } from 'ol/geom';
import GeometryType from 'ol/geom/GeometryType';

@Component({
  selector: 'app-neighborhood-map',
  templateUrl: './neighborhood-map.component.html',
  styleUrls: ['./neighborhood-map.component.css']
})
export class NeighborhoodMapComponent implements OnInit {
  private map: Map;
  private styles: any;
  private drawLayer: VectorLayer;
  private getMapGeometryOptions = {
    portals: 'y',
    links: 'n',
    fields: 'n',
  };

  constructor(
    private mapGeometryService: MapGeometryService,
    private neighborhoodSelectService: NeighborhoodSelectService,
  ) {
    this.styles = {};
    // XXX had trouble getting let..of to work on enums, then arrays, so these are all literals
    for (const team of [0, 1, 2]) {
      this.styles[team] = {};
      for (const level of [1, 2, 3, 4, 5, 6, 7, 8]) {
        if (team === 0 && !(level === 1)) {
          continue;
        }
        this.styles[team][level] = new Style({
          image: new Icon({
            src: `/assets/images/${team}/${level}.png`
          })
        });
      }
    }
  }

  private renderMap(mapGeometry: MapGeometry) {
    const layerFactory = new OLLayerFactory(mapGeometry);

    const portalGroup = new Group();
    portalGroup.set('title', 'Portals');
    portalGroup.set('fold', 'open');
    portalGroup.setLayers(layerFactory.toPortalLayer());

    const source = new VectorSource({ wrapX: false });

    this.drawLayer = new VectorLayer({
      source,
    });
    this.map = new Map({
      target: 'neighborhood-map',
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        portalGroup,
        this.drawLayer,
      ],
      view: new View({
        center: fromLonLat([Constants.MAP_X, Constants.MAP_Y]),
        zoom: Constants.MAP_Z,
      })
    });

    const draw = new Draw({
      type: 'Polygon' as GeometryType,
      source,
    });
    draw.on('drawend', event => this.onDrawEnd(event));
    draw.on('drawstart', event => this.onDrawStart(event));
    this.map.addInteraction(draw);
  }

  ngOnInit(): void {
    // XXX if this fails we want it to not render the map
    this.mapGeometryService.getMapGeometry(this.getMapGeometryOptions).subscribe(data => this.renderMap(data));
  }

  onDrawEnd(event: DrawEvent) {
    const userPolygon = event.feature.getGeometry() as Polygon;
    const rings = userPolygon.getCoordinates();

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (const ring of rings) {
      for (const coords of ring) {
        if (coords[0] < minX) {
          minX = coords[0];
        }
        if (coords[0] > maxX) {
          maxX = coords[0];
        }
        if (coords[1] < minY) {
          minY = coords[1];
        }
        if (coords[1] > maxY) {
          maxY = coords[1];
        }
      }
    }

    const newPolygon = new Polygon([[
      [minX, minY],
      [maxX, minY],
      [maxX, maxY],
      [minX, maxY],
      [minX, minY],
    ]]);
    event.feature.setGeometry(newPolygon);


    const neighborhoodSelect: NeighborhoodSelect = {
        max_x: maxX,
        max_y: maxY,
        min_x: minX,
        min_y: minY,
    };

    this.neighborhoodSelectService.sendMessage(neighborhoodSelect);
  }

  onDrawStart(event: DrawEvent) {
    this.drawLayer.getSource().clear();
  }
}
