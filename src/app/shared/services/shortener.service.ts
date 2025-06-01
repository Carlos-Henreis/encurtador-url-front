import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

interface ShortenRequest {
  urlOrigem: string;
}

interface ShortenResponse {
  urlEncurtada: string;
}

@Injectable({ providedIn: 'root' })
export class ShortenerService {
  private readonly api = 'http://localhost:8080';
  private http = inject(HttpClient);


  shorten(url: string, tokenReCaaptcha?: string): Observable<HttpResponse<ShortenResponse>> {
    return this.http.post<ShortenResponse>(`${this.api}/`, {
      urlOrigem: url
    }, {
      headers: {
        'Content-Type': 'application/json',
        'X-Recaptcha-Token': tokenReCaaptcha || ''
      },
      observe: 'response'
    });
  }

  getQrCode(path: string, tokenReCaaptcha?: string): Observable<HttpResponse<Blob>> {
    return this.http.get(`${this.api}/qrcode/${path}`, {
      responseType: 'blob',
      headers: {
        'Content-Type': 'application/json',
        'X-Recaptcha-Token': tokenReCaaptcha || ''
      },
      observe: 'response'
    });
  }

  getStatistics(path: string, tokenReCaaptcha?: string): Observable<HttpResponse<any>> {
    return this.http.get(`${this.api}/stats/${path}`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Recaptcha-Token': tokenReCaaptcha || ''
      },
      observe: 'response'
    });
  }

}
