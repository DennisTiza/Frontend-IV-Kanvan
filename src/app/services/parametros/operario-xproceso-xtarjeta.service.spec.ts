import { TestBed } from '@angular/core/testing';

import { OperarioXProcesoXTarjetaService } from './operario-xproceso-xtarjeta.service';

describe('OperarioXProcesoXTarjetaService', () => {
  let service: OperarioXProcesoXTarjetaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OperarioXProcesoXTarjetaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
