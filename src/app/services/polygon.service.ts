// src/app/services/polygon.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PolygonService {
  private apiUrl = 'http://localhost:3001/polygons';

  constructor(private http: HttpClient) { }

  getPolygons(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}