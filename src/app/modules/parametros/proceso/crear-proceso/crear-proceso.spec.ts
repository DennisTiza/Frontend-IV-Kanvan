import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearProceso } from './crear-proceso';

describe('CrearProceso', () => {
  let component: CrearProceso;
  let fixture: ComponentFixture<CrearProceso>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearProceso]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearProceso);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
