import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, Inject, PLATFORM_ID, NgZone } from '@angular/core';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { PolygonDetalleService } from '../../services/polygon-detalle.service';
import { Polygon } from '../../models/polygon';
import Swal from 'sweetalert2';
import { RouterModule, RouterOutlet, Router } from '@angular/router';
import { PolygonDetalle } from '../../models/polygon-detalle';
import { MarkerService } from '../../services/marker.service';
import { Marker } from '../../models/marker';
import MarkerClusterer from '@googlemaps/markerclustererplus';

@Component({
  selector: 'app-poligono-detalles',
  standalone: true,
  imports: [CommonModule, GoogleMapsModule, HttpClientModule, RouterOutlet, RouterModule],
  templateUrl: './poligono-detalles.component.html',
  styleUrls: ['./poligono-detalles.component.css']
})
export class PoligonoDetallesComponent implements OnInit {
  polygonId!: number;
  apiLoaded: boolean = false;
  map!: google.maps.Map;
  selectedPolygon!: PolygonDetalle;
  markers: Marker[] = [];

  mapOptions: google.maps.MapOptions = {
    center: { lat: 26.918187338222793, lng: -105.65337254005449 },
    zoom: 15
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
    this.loadMarkers();
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
      this.loadPolygonDetails();
    } else {
      console.error("No se encontró el elemento del mapa en el DOM.");
    }
  }

  private loadPolygonDetails(): void {
    this.polygonDetalleService.getPolygonById(this.polygonId).subscribe((polygonData) => {
      this.selectedPolygon = polygonData;
      this.displayPolygonOnMap();
     // this.addMarkersToMap();
    });
  }

  private displayPolygonOnMap(): void {
    const polygonOptions: google.maps.PolygonOptions = {
      paths: this.selectedPolygon.vertices,
      ...this.selectedPolygon.options
    };

    const newPolygon = new google.maps.Polygon(polygonOptions);
    newPolygon.setMap(this.map);

    const bounds = new google.maps.LatLngBounds();
    this.selectedPolygon.vertices.forEach(vertex => bounds.extend(vertex));
    this.map.fitBounds(bounds);
  }

 

  private loadMarkers(): void {
    this.markerService.getMarkers().subscribe({
      next: (markers: Marker[]) => {
        console.log('Marcadores recibidos del backend:', markers); // Imprimir los marcadores en la consola
        this.markers = markers;
    //    this.addMarkersToMap();
      },
      error: (error: any) => {
        console.error('Error al cargar los marcadores:', error);
      }
    });
  }
  
  

}
