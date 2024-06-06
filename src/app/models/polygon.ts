export interface Polygon {
}

// src/app/models/polygon.model.ts

export interface Polygon {
    paths: { lat: number, lng: number }[];
    strokeColor: string;
    strokeOpacity: number;
    strokeWeight: number;
    fillColor: string;
    fillOpacity: number;
  }
  
  export interface Polygon {
    id: number;
    options: Polygon;
  }
