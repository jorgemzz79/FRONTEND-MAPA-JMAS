import { Routes } from '@angular/router';
import { PoligonoDetallesComponent } from './components/poligono-detalles/poligono-detalles.component';
import { MapComponent } from './components/map/map.component';

export const routes: Routes = [
    { path: '', redirectTo: 'map', pathMatch: 'full' },
    { path: 'map', component: MapComponent },
    { path: 'poligono-detalles/:id', component: PoligonoDetallesComponent }
  ];