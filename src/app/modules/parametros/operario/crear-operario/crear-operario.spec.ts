import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearOperario } from './crear-operario';

describe('CrearOperario', () => {
  let component: CrearOperario;
  let fixture: ComponentFixture<CrearOperario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearOperario]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearOperario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
