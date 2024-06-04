import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MapComponent } from './components/map/map.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, MapComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'FRONTEND-MAPA-JMAS';
}
