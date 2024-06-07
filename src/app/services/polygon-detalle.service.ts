import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { PolygonDetalle } from '../models/polygon-detalle';

@Injectable({
  providedIn: 'root'
})
export class PolygonDetalleService {
  private apiUrl = 'http://localhost:3001/polygons'; // URL de la API o JSON
  private detalleApiUrl = 'http://localhost:3001/detallePoligono'; // URL de la API para detalles

  constructor(private http: HttpClient) {}

  getPolygons(): Observable<PolygonDetalle[]> {
    return this.http.get<PolygonDetalle[]>(this.apiUrl);
  }

  getPolygonById(id: number): Observable<PolygonDetalle> {
    return this.http.get<PolygonDetalle>(`${this.apiUrl}/${id}`);
  }

  getPolygonDetalleById(id: number): Observable<any> {
    return this.http.get<any>(`${this.detalleApiUrl}/${id}`);
  }
}
