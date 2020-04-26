import { Component, OnInit } from '@angular/core';

import { Map, View, Feature, Observable } from 'ol';
import TileLayer from 'ol/layer/Tile';
import { OSM, Vector } from 'ol/source';
import { fromLonLat, toLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import { Point } from 'ol/geom';
import VectorSource from 'ol/source/Vector';
import { Style, Icon } from 'ol/style';
import  LayerSwitcher from 'ol-layerswitcher';

import { Constants } from '../constants'
import { MostWantedMap } from '../mostwanted-map';
import { MostwantedMapService } from '../mostwanted-map.service';



@Component({
  selector: 'app-mostwanted-map',
  templateUrl: './mostwanted-map.component.html',
  styleUrls: [
    './mostwanted-map.component.css',
    ]
})
export class MostwantedMapComponent implements OnInit {

  private map: Map
  private styles: any;

  constructor(
    private mostWantedMapService: MostwantedMapService
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

  private renderMap(data: MostWantedMap[]) {
    let styleMap = this.styles;
    function dataToFeature(portal: MostWantedMap) {
      let feature = new Feature(new Point(fromLonLat([portal.lng / 1e6, portal.lat / 1e6])));
      feature.setStyle(styleMap[portal.team][portal.level]);
      return feature;
    }
    let portals = data.map(dataToFeature);

    let portalLayer = new VectorLayer({
      source: new VectorSource({
        features: portals
      })
    });
    // Hack around some typescript stuff with ol-layerswitcher
    portalLayer.set('title', 'Portal layer');

    this.map = new Map({
      target: 'mostwanted-map',
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        portalLayer,
      ],
      view: new View({
        center: fromLonLat([Constants.MAP_X, Constants.MAP_Y]),
        zoom: Constants.MAP_Z,
      })
    });

    let layerSwitcher = new LayerSwitcher();
    this.map.addControl(layerSwitcher);
  }

  ngOnInit(): void {
    // XXX if this fails we want it to not render the map
    this.mostWantedMapService.getMostWantedMap().subscribe(data => this.renderMap(data));
  }

}
