import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface ShortenRequest {
  urlOrigem: string;
}

interface ShortenResponse {
  urlEncurtada: string;
}

@Injectable({ providedIn: 'root' })
export class ShortenerService {
  private readonly api = 'https://chr.app.br';
  private http = inject(HttpClient);


  shorten(url: string): Observable<ShortenResponse> {
    return this.http.post<ShortenResponse>(`${this.api}/`, {
      urlOrigem: url
    });
  }

  getQrCode(path: string): Observable<Blob> {
    return this.http.get(`${this.api}/qrcode/${path}`, {
      responseType: 'blob'
    });
  }

  getStatistics(path: string): Observable<any> {
    return this.http.get(`${this.api}/stats/${path}`);
  }

}
