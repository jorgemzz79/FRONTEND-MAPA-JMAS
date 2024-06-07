import { Component, OnInit, Inject, PLATFORM_ID,NgZone } from '@angular/core';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { PolygonService } from '../../services/polygon.service';
import { Polygon } from '../../models/polygon';
import Swal from 'sweetalert2';
import { RouterModule, RouterOutlet, Router } from '@angular/router';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, GoogleMapsModule, HttpClientModule, RouterOutlet, RouterModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  apiLoaded: boolean = false;
  map!: google.maps.Map;
  polygons: Polygon[] = [];

  mapOptions: google.maps.MapOptions = {
    center: { lat: 26.918187338222793, lng: -105.65337254005449 },
    zoom: 15
  };

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object,
    private polygonService: PolygonService,
    private router: Router, // Inyectar el Router aquí,
    private _ngZone: NgZone, private _router: Router,
    private zone: NgZone

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

    (window as any)['initMap'] = () => {
      this.apiLoaded = true;
      this.initializeMap();
    };
  }

  private initializeMap(): void {
    const mapElement = this.document.getElementById('map');
    if (mapElement) {
      this.map = new google.maps.Map(mapElement, this.mapOptions);
      this.map.addListener('zoom_changed', () => {
        this.onZoomChanged();
      });
      this.polygonService.getPolygons().subscribe((data) => {
        this.polygons = data;
        this.addPolygonsToMap();
      });
    } else {
      console.error("No se encontró el elemento del mapa en el DOM.");
    }
  }

  private addPolygonsToMap(): void {
    this.polygons.forEach((polygonData) => {
      const newPolygon = new google.maps.Polygon(polygonData.options);
      newPolygon.setMap(this.map);
      newPolygon.addListener('click', () => {
        this.onPolygonClicked(polygonData.id);
      });
    });
  }

  private onZoomChanged(): void {
    console.log('Zoom changed!');
  }

  private onPolygonClicked(id: number): void {
    this.zone.run(() => {
      this.router.navigate(['/poligono-detalles',id]);
  });
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: `SELECCION EN POLIGONO ID: ${id}`,
      showConfirmButton: false,
      timer: 1500
    });
  }
}
