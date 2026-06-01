import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarProcesoProduccion } from './editar-proceso-produccion';

describe('EditarProcesoProduccion', () => {
  let component: EditarProcesoProduccion;
  let fixture: ComponentFixture<EditarProcesoProduccion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarProcesoProduccion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarProcesoProduccion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
