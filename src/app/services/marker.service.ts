import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Marker } from '../models/marker';

@Injectable({
  providedIn: 'root'
})
export class MarkerService {
  private apiUrl = 'http://localhost:3001/marcadores'; // URL de la API para los marcadores

  constructor(private http: HttpClient) {}

  getMarkers(): Observable<Marker[]> {
    return this.http.get<Marker[]>(this.apiUrl);
  }
}
