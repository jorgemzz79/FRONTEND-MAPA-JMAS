import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoligonoDetallesComponent } from './poligono-detalles.component';

describe('PoligonoDetallesComponent', () => {
  let component: PoligonoDetallesComponent;
  let fixture: ComponentFixture<PoligonoDetallesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoligonoDetallesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PoligonoDetallesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
