export interface Marker {
  lat: number;
  lng: number;
}

export interface PolygonDetalle {
  id: number;
  vertices: google.maps.LatLngLiteral[];
  options: google.maps.PolygonOptions;
  markers: Marker[];
}
