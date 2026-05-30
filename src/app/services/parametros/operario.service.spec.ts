import { TestBed } from '@angular/core/testing';

import { OperarioService } from './operario.service';

describe('OperarioService', () => {
  let service: OperarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OperarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
