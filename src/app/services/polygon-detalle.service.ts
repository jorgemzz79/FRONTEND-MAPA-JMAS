// polygon.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PolygonDetalle } from '../models/polygon-detalle';

@Injectable({
  providedIn: 'root'
})
export class PolygonDetalleService {
  private apiUrl = 'http://localhost:3001/polygons'; // URL de la API o JSON

  constructor(private http: HttpClient) {}

  getPolygons(): Observable<PolygonDetalle[]> {
    return this.http.get<PolygonDetalle[]>(this.apiUrl);
  }

  getPolygonById(id: number): Observable<PolygonDetalle> {
    return this.http.get<PolygonDetalle>(`${this.apiUrl}/${id}`);
  }
}