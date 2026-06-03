import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearTarjetaProduccion } from './crear-tarjeta-produccion';

describe('CrearTarjetaProduccion', () => {
  let component: CrearTarjetaProduccion;
  let fixture: ComponentFixture<CrearTarjetaProduccion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearTarjetaProduccion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearTarjetaProduccion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
