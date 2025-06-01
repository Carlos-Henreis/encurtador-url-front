import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from '../../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

declare global {
  interface Window {
    grecaptcha: any;
  }
}

@Injectable({
  providedIn: 'root',
})
export class ReCaptchaConfigService {
  private widgetId: number | null = null;
  private tokenResolver?: (token: string) => void;
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  init(containerId: string): Promise<void> {
    if (!this.isBrowser) return Promise.resolve(); // SSR: ignora
    return new Promise((resolve) => {
      window.grecaptcha.ready(() => {
        this.widgetId = window.grecaptcha.render(containerId, {
          sitekey: environment.RECAPTCHA_SITE_KEY,
          size: 'invisible',
          callback: (token: string) => {
            if (this.tokenResolver){
              this.tokenResolver(token);
              window.grecaptcha.reset(this.widgetId!);
            }
          },
        });
        resolve();
      });
    });
  }

  execute(): Promise<string> {
    if (!this.isBrowser) return Promise.reject('Executado no servidor');
    return new Promise((resolve) => {
      if (this.widgetId === undefined) {
        throw new Error('reCAPTCHA não foi inicializado');
      }
      this.tokenResolver = resolve;
      window.grecaptcha.execute(this.widgetId);
    });
  }
}