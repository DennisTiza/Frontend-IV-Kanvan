import { TestBed } from '@angular/core/testing';

import { ProductoXProcesoService } from './producto-xproceso.service';

describe('ProductoXProcesoService', () => {
  let service: ProductoXProcesoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductoXProcesoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
