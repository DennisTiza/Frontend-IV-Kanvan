import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { redireccionWildcardGuard } from './redireccion-wildcard.guard';

describe('redireccionWildcardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => redireccionWildcardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
