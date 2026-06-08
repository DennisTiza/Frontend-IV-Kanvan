import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { guardarUltimaRutaGuard } from './guardar-ultima-ruta.guard';

describe('guardarUltimaRutaGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => guardarUltimaRutaGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
