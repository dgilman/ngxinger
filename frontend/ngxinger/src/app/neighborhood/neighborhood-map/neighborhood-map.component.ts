import { Component, OnInit } from '@angular/core';

import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Group } from 'ol/layer';
import { fromLonLat } from 'ol/proj';
import { Style, Icon } from 'ol/style';

import { Constants } from '../../constants'
import { MapGeometry, OLLayerFactory } from '../../map-geometry';
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
  private map: Map
  private styles: any;
  private drawLayer: VectorLayer;
  private getMapGeometryOptions = {
    portals: "y",
    links: "n",
    fields: "n",
  }

  constructor(
    private mapGeometryService: MapGeometryService,
  ) {
    this.styles = {};
    // XXX had trouble getting let..of to work on enums, then arrays, so these are all literals
    for (let team of [0, 1, 2]) {
      this.styles[team] = {};
      for (let level of [1, 2, 3, 4, 5, 6, 7, 8]) {
        if (team === 0 && !(level === 1)) {
          continue;
        }
        this.styles[team][level] = new Style({
          image: new Icon({
            src: `/assets/images/${team}/${level}.png`
          })
        })
      }
    }
  }

  private renderMap(mapGeometry: MapGeometry) {
    let layerFactory = new OLLayerFactory(mapGeometry);

    let portalGroup = new Group();
    portalGroup.set("title", "Portals");
    portalGroup.set("fold", "open");
    portalGroup.setLayers(layerFactory.toPortalLayer());

    let source = new VectorSource({ wrapX: false });

    this.drawLayer = new VectorLayer({
      source: source,
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

    let draw = new Draw({
      type: "Polygon" as GeometryType,
      source: source,
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
    let userPolygon = <Polygon>event.feature.getGeometry();
    let rings = userPolygon.getCoordinates();

    let min_x = Infinity;
    let min_y = Infinity;
    let max_x = -Infinity;
    let max_y = -Infinity;

    for (let ring of rings) {
      for (let coords of ring) {
        if (coords[0] < min_x) {
          min_x = coords[0];
        };
        if (coords[0] > max_x) {
          max_x = coords[0];
        };
        if (coords[1] < min_y) {
          min_y = coords[1];
        };
        if (coords[1] > max_y) {
          max_y = coords[1];
        }
      }
    }

    let newPolygon = new Polygon([[
      [min_x, min_y],
      [max_x, min_y],
      [max_x, max_y],
      [min_x, max_y],
      [min_x, min_y],
    ]]);
    event.feature.setGeometry(newPolygon);
  }

  onDrawStart(event: DrawEvent) {
    this.drawLayer.getSource().clear();
  }
}
