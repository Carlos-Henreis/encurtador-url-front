import { TestBed } from '@angular/core/testing';

import { RecaptchaConfigService } from './recaptcha-config.service';

describe('RecaptchaConfigService', () => {
  let service: RecaptchaConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecaptchaConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
