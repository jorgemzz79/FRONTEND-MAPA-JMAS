import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
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

  polygons: { id: number, options: google.maps.PolygonOptions }[] = [
    {
      id: 1,
      options: {
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
    },
    {
      id: 2,
      options: {
        paths: [
          { lat: 26.91961486025175, lng: -105.65189250372669 },
          { lat: 26.922741204331913, lng: -105.65155122614748 },
          { lat: 26.923361337233843, lng: -105.65330663012942 },
          { lat: 26.922964900949918, lng: -105.65351468418862 },
          { lat: 26.922917070925035, lng: -105.65337453876327 },
          { lat: 26.922830976828596, lng: -105.65346372221502 },
          { lat: 26.92246826273218, lng: -105.65367820240145 },
          { lat: 26.92238396193005, lng: -105.65375866867417 },
          { lat: 26.921595782957706, lng: -105.65429238452657 },
          { lat: 26.921393902486503, lng: -105.65268718311074 },
          { lat: 26.91968242375524, lng: -105.65280884049146 }
        ],
        strokeColor: '#00FF00', // Cambia el color de la línea si lo deseas
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#00FF00', // Cambia el color de relleno si lo deseas
        fillOpacity: 0.35
      }
    }
  ];

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadGoogleMapsApi();
    }
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
        this.onZoomChanged();
      });

      // Agrega los polígonos al mapa
      this.polygons.forEach((polygonData) => {
        const newPolygon = new google.maps.Polygon(polygonData.options);
        newPolygon.setMap(this.map);
        newPolygon.addListener('click', () => {
          this.onPolygonClicked(polygonData.id);
        });
      });
    } else {
      console.error("No se encontró el elemento del mapa en el DOM.");
    }
  }

  private onZoomChanged(): void {
    console.log('Zoom changed!');
    // Aquí puedes agregar cualquier lógica que necesites cuando el zoom cambia
  }

  private onPolygonClicked(id: number): void {
    alert(`Polygon clicked with ID: ${id}`);
  }
}
