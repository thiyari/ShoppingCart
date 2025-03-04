import { TestBed } from '@angular/core/testing';

import { PrerenderParamsService } from './prerender-params.service';

describe('PrerenderParamsService', () => {
  let service: PrerenderParamsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrerenderParamsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
