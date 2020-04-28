import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MostwantedComponent } from './mostwanted/mostwanted.component';
import { NeighborhoodComponent } from './neighborhood/neighborhood.component';

const routes: Routes = [
  { path: '', redirectTo: 'mostwanted', pathMatch: 'full'},
  { path: 'mostwanted', component: MostwantedComponent},
  { path: 'neighborhood', component: NeighborhoodComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
