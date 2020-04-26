import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';


/* inger components */

import { MostwantedComponent } from './mostwanted/mostwanted.component';
import { NeighborhoodComponent } from './neighborhood/neighborhood.component';
import { TopbarComponent } from './topbar/topbar.component'
import { MostwantedMapComponent } from './mostwanted/mostwanted-map/mostwanted-map.component';


@NgModule({
  declarations: [
    AppComponent,
    MostwantedComponent,
    NeighborhoodComponent,
    TopbarComponent,
    MostwantedMapComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatToolbarModule,
    MatSidenavModule,
    MatCardModule,
    MatGridListModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
