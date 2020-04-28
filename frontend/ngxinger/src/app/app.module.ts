import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { ChartsModule } from 'ng2-charts';

/* inger components */

import { MostwantedComponent } from './mostwanted/mostwanted.component';
import { NeighborhoodComponent } from './neighborhood/neighborhood.component';
import { MostwantedMapComponent } from './mostwanted/mostwanted-map/mostwanted-map.component';
import { MostwantedTableComponent } from './mostwanted/mostwanted-table/mostwanted-table.component';
import { NeighborhoodMapComponent } from './neighborhood/neighborhood-map/neighborhood-map.component';
import { NeighborhoodHourlyChartComponent } from './neighborhood/neighborhood-hourly-chart/neighborhood-hourly-chart.component';
import { NeighborhoodPlayerChartComponent } from './neighborhood/neighborhood-player-chart/neighborhood-player-chart.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    AppComponent,
    MostwantedComponent,
    NeighborhoodComponent,
    MostwantedMapComponent,
    MostwantedTableComponent,
    NeighborhoodMapComponent,
    NeighborhoodHourlyChartComponent,
    NeighborhoodPlayerChartComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ChartsModule,
    NgbModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
