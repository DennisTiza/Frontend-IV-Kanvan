import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearCodigo } from './crear-codigo';

describe('CrearCodigo', () => {
  let component: CrearCodigo;
  let fixture: ComponentFixture<CrearCodigo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearCodigo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearCodigo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
