import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumenAsignaciones } from './resumen-asignaciones';

describe('ResumenAsignaciones', () => {
  let component: ResumenAsignaciones;
  let fixture: ComponentFixture<ResumenAsignaciones>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumenAsignaciones]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumenAsignaciones);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
