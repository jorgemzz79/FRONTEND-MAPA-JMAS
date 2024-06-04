import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, GoogleMapsModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  apiLoaded: boolean = false;
  map!: google.maps.Map;

  mapOptions: google.maps.MapOptions = {
    center: { lat: 26.918187338222793, lng: -105.65337254005449 },
    zoom: 15
  };

  polygons: google.maps.PolygonOptions[] = [
    {
      paths: [
        { lat: 26.919232508572446, lng: -105.65187880137567 },
        { lat: 26.919433401103497, lng: -105.65424987414661 },
        { lat: 26.917044191765, lng: -105.6544966373846 },
        { lat: 26.91684807823939, lng: -105.65214165786564 },
      ],
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35
    }
  ];

  constructor(@Inject(DOCUMENT) private document: Document) { }

  ngOnInit(): void {
    this.loadGoogleMapsApi();
  }

  private loadGoogleMapsApi(): void {
    const script = this.document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}&callback=initMap`;
    script.defer = true;
    script.async = true;
    this.document.body.appendChild(script);

    // Agrega una función de inicialización global
    (window as any)['initMap'] = () => {
      this.apiLoaded = true;
      this.initializeMap();
    };
  }

  private initializeMap(): void {
    const mapElement = this.document.getElementById('map');
    if (mapElement) {
      this.map = new google.maps.Map(mapElement, this.mapOptions);

      // Agrega un listener para el cambio de zoom
      this.map.addListener('zoom_changed', () => {
        this.polygonClicked();
      });

      // Agrega los polígonos al mapa
      this.polygons.forEach((polygonOptions: google.maps.PolygonOptions) => {
        const newPolygon = new google.maps.Polygon(polygonOptions);
        newPolygon.setMap(this.map);
        newPolygon.addListener('click', () => {
          this.polygonClicked();
        });
      });
    } else {
      console.error("No se encontró el elemento del mapa en el DOM.");
    }
  }

  private polygonClicked(): void {
    alert('Polygon clicked!');
  }
}
