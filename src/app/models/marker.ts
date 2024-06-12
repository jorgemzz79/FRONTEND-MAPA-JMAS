
  export interface Marker {
    id: number;
    name: string;
    accountNumber: string; // Añadir esta propiedad
    markers: { cuenta:string, lat: number, lng: number }[];
  }