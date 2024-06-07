import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-poligono-detalles',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './poligono-detalles.component.html',
  styleUrl: './poligono-detalles.component.css'
})
export class PoligonoDetallesComponent implements OnInit {
  polygonId!: number;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.polygonId = +params['id']; // Asegúrate de convertir el parámetro a número
    });
  }
}

