import { TestBed } from '@angular/core/testing';

import { ProcesoXtarjetaService } from './proceso-xtarjeta.service';

describe('ProcesoXtarjetaService', () => {
  let service: ProcesoXtarjetaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProcesoXtarjetaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
