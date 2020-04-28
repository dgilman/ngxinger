import { Component, OnInit, OnDestroy } from '@angular/core';

import { Map, View, Feature } from 'ol';
import TileLayer from 'ol/layer/Tile';
import { OSM } from 'ol/source';
import { Group } from 'ol/layer';
import { fromLonLat } from 'ol/proj';
import { Style, Icon, Stroke } from 'ol/style';
import LayerSwitcher from 'ol-layerswitcher';
import { Coordinate } from 'ol/coordinate';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Circle from 'ol/geom/Circle';

import { Constants } from '../../constants';
import { MapGeometry, OLLayerFactory } from '../../map-geometry';
import { MapGeometryService } from '../../map-geometry.service';
import { MostWantedMapUpdateService } from '../mostwanted-map-update.service';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-mostwanted-map',
  templateUrl: './mostwanted-map.component.html',
  styleUrls: [
    './mostwanted-map.component.css',
    ]
})
export class MostwantedMapComponent implements OnInit, OnDestroy {

  private map: Map;
  private styles: any;
  private mapUpdateServiceSubscription: Subscription;
  private circleLayer: VectorLayer;
  private getMapGeometryOptions = {
    portals: 'y',
    links: 'y',
    fields: 'y',
  };

  constructor(
    private mapGeometryService: MapGeometryService,
    private mostWantedMapUpdateService: MostWantedMapUpdateService
  ) {
    this.mapUpdateServiceSubscription = this.mostWantedMapUpdateService.getMessage().subscribe(coord => {
      this.updateMap(coord);
    });

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
    portalGroup.setLayers(layerFactory.toPortalLayer());

    const linkGroup = new Group();
    linkGroup.set('title', 'Links');
    linkGroup.setLayers(layerFactory.toLinkLayer());

    const fieldGroup = new Group();
    fieldGroup.setLayers(layerFactory.toFieldLayer());
    fieldGroup.set('title', 'Fields');

    [portalGroup, linkGroup, fieldGroup].forEach(group => {
      group.set('fold', 'open');
    });

    this.circleLayer = new VectorLayer({
      source: new VectorSource(),
      style: new Style({
        stroke: new Stroke({
          color: 'red',
          width: 5,
        })
      })
    });

    this.map = new Map({
      target: 'mostwanted-map',
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        fieldGroup,
        linkGroup,
        portalGroup,
        this.circleLayer,
      ],
      view: new View({
        center: fromLonLat([Constants.MAP_X, Constants.MAP_Y]),
        zoom: Constants.MAP_Z,
      })
    });

    const layerSwitcher = new LayerSwitcher();
    this.map.addControl(layerSwitcher);
  }

  private updateMap(coord: Coordinate) {
    const circleLayerSource = this.circleLayer.getSource();
    circleLayerSource.clear();
    circleLayerSource.addFeature(new Feature(new Circle(coord, 60)));

    const view = this.map.getView();
    view.animate({
      center: coord,
      duration: 2000,
      zoom: 15,
    });
  }

  ngOnInit(): void {
    // XXX if this fails we want it to not render the map
    this.mapGeometryService.getMapGeometry(this.getMapGeometryOptions).subscribe(data => this.renderMap(data));
  }

  ngOnDestroy(): void {
    this.mapUpdateServiceSubscription.unsubscribe();
  }

}
