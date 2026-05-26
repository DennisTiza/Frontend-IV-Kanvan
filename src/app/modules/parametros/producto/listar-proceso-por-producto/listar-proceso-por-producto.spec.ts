import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarProcesoPorProducto } from './listar-proceso-por-producto';

describe('ListarProcesoPorProducto', () => {
  let component: ListarProcesoPorProducto;
  let fixture: ComponentFixture<ListarProcesoPorProducto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarProcesoPorProducto]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarProcesoPorProducto);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
