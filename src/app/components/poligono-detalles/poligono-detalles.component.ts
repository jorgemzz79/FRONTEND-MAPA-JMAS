import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, Inject, PLATFORM_ID, NgZone, ViewChild } from '@angular/core';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { GoogleMapsModule, GoogleMap } from '@angular/google-maps';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { PolygonDetalleService } from '../../services/polygon-detalle.service';
import { Polygon } from '../../models/polygon';
import Swal from 'sweetalert2';
import { RouterModule, RouterOutlet, Router } from '@angular/router';
import { PolygonDetalle } from '../../models/polygon-detalle';
import { MarkerService } from '../../services/marker.service';
import { Marker } from '../../models/marker';

@Component({
  selector: 'app-poligono-detalles',
  standalone: true,
  imports: [CommonModule, GoogleMapsModule, HttpClientModule, RouterOutlet, RouterModule],
  templateUrl: './poligono-detalles.component.html',
  styleUrls: ['./poligono-detalles.component.css']
})
export class PoligonoDetallesComponent implements OnInit {
  @ViewChild(GoogleMap, { static: false }) mapComponent!: GoogleMap;
  polygonId!: number;
  apiLoaded: boolean = false;
  map!: google.maps.Map;
  currentPolygon?: google.maps.Polygon;
  selectedPolygon!: PolygonDetalle;
  markers: Marker[] = [];

  mapOptions: google.maps.MapOptions = {
    center: { lat: 26.92609486543298, lng: -105.736332352847 },
    zoom: 15,
  };

  constructor(
    private markerService: MarkerService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object,
    private polygonDetalleService: PolygonDetalleService,
    private router: Router,
    private _ngZone: NgZone,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.polygonId = +params['id'];
      if (isPlatformBrowser(this.platformId)) {
        this.loadGoogleMapsApi();
      }
    });
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
      this.map.addListener('zoom_changed', () => this.onZoomChange());
      this.loadPolygonDetails();
      this.loadMarkers();
    } else {
      console.error("No se encontró el elemento del mapa en el DOM.");
    }
  }

  private clearMap(): void {
    if (this.currentPolygon) {
      this.currentPolygon.setMap(null);
    }
    this.markers.forEach(marker => {
      marker.markers.forEach(position => {
        const markerObj = new google.maps.Marker({
          position: { lat: position.lat, lng: position.lng },
          map: null,
          ...this.mapOptions
        });
        markerObj.setMap(null);
      });
    });
  }

  private loadPolygonDetails(): void {
    this.polygonDetalleService.getPolygonById(this.polygonId).subscribe((polygonData) => {
      this.selectedPolygon = polygonData;
      console.log('Polygon Details:', this.selectedPolygon);
      this.displayPolygonOnMap();
    });
  }

  private loadMarkers(): void {
    this.markerService.getMarkers().subscribe({
      next: (markers: Marker[]) => {
        console.log('Marcadores recibidos del backend:', markers);
        this.markers = markers;
        this.addMarkersToMap();
        this.addLabelsToMap();
      },
      error: (error: any) => {
        console.error('Error al cargar los marcadores:', error);
      }
    });
  }

  private displayPolygonOnMap(): void {
    console.log("SE EJECUTO AFUERA");
    console.log('===========>:', this.selectedPolygon);
  
    this.clearMap();
  
    const polygonOptions: google.maps.PolygonOptions = {
      paths: this.selectedPolygon.vertices,
      ...this.selectedPolygon.options
    };
  
    this.currentPolygon = new google.maps.Polygon(polygonOptions);
    this.currentPolygon.setMap(this.map);
  
    const centroid = this.calculateCentroid(this.selectedPolygon.vertices);
  
    setTimeout(() => {
      if (this.map && this.currentPolygon) {
        this.map.setCenter(new google.maps.LatLng(centroid.lat, centroid.lng));
        const bounds = new google.maps.LatLngBounds();
        this.currentPolygon.getPath().forEach((vertex: google.maps.LatLng) => {
          bounds.extend(vertex);
        });
        this.map.fitBounds(bounds);
      }
    }, 50);
  }

  private addMarkersToMap(): void {
    this.markers.forEach(marker => {
      marker.markers.forEach(position => {
        const markerObj = new google.maps.Marker({
          position: { lat: position.lat, lng: position.lng },
          map: this.map,
          ...this.mapOptions
        });

        markerObj.addListener('click', () => {
          this.onMarkerClick(marker, position);
        });
      });
    });
  }

  private addLabelsToMap(): void {
    this.markers.forEach(marker => {
      marker.markers.forEach(position => {
        const label = new google.maps.InfoWindow({
          content: marker.accountNumber,
          position: { lat: position.lat, lng: position.lng },
          disableAutoPan: true
        });
        label.open(this.map);
      });
    });
  }

  private onZoomChange(): void {
    // No need to update the font size here since we're using InfoWindows
  }

  private onMarkerClick(marker: Marker, position: { lat: number, lng: number }): void {
    console.log('Marcador clicado:', marker);
    console.log('Posición del marcador clicado:', position);
  }

  calculateCentroid(paths: { lat: number; lng: number }[]): { lat: number; lng: number } {
    if (!paths || paths.length === 0) {
      return { lat: 0, lng: 0 };
    }
  
    let centroid = { lat: 0, lng: 0 };
    let signedArea = 0.0;
    let x0 = 0.0;
    let y0 = 0.0;
    let x1 = 0.0;
    let y1 = 0.0;
    let a = 0.0;
  
    for (let i = 0; i < paths.length - 1; ++i) {
      x0 = paths[i].lng;
      y0 = paths[i].lat;
      x1 = paths[i + 1].lng;
      y1 = paths[i + 1].lat;
      a = x0 * y1 - x1 * y0;
      signedArea += a;
      centroid.lng += (x0 + x1) * a;
      centroid.lat += (y0 + y1) * a;
    }
  
    x0 = paths[paths.length - 1].lng;
    y0 = paths[paths.length - 1].lat;
    x1 = paths[0].lng;
    y1 = paths[0].lat;
    a = x0 * y1 - x1 * y0;
    signedArea += a;
    centroid.lng += (x0 + x1) * a;
    centroid.lat += (y0 + y1) * a;
  
    signedArea *= 0.5;
    centroid.lng /= (6.0 * signedArea);
    centroid.lat /= (6.0 * signedArea);
  
    return centroid;
  }
}
