import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

/* inger components */

import { MostwantedComponent } from './mostwanted/mostwanted.component';
import { NeighborhoodComponent } from './neighborhood/neighborhood.component';
import { TopbarComponent } from './topbar/topbar.component'

import { MatToolbarModule } from '@angular/material/toolbar';
import { MostwantedMapComponent } from './mostwanted-map/mostwanted-map.component';

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
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
