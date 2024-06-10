
  export interface Marker {
    id: number;
    name: string;
    accountNumber: string; // Añadir esta propiedad
    markers: { lat: number, lng: number }[];
  }