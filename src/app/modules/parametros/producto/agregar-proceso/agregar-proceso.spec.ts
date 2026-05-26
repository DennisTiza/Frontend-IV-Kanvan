import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarProceso } from './agregar-proceso';

describe('AgregarProceso', () => {
  let component: AgregarProceso;
  let fixture: ComponentFixture<AgregarProceso>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarProceso]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarProceso);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
