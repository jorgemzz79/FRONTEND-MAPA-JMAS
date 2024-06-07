import { TestBed } from '@angular/core/testing';

import { PolygonDetalleService } from './polygon-detalle.service';

describe('PolygonDetalleService', () => {
  let service: PolygonDetalleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PolygonDetalleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
