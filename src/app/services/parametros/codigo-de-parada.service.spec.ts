import { TestBed } from '@angular/core/testing';

import { CodigoDeParadaService } from './codigo-de-parada.service';

describe('CodigoDeParadaService', () => {
  let service: CodigoDeParadaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CodigoDeParadaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
