import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-redirect',
  imports: [CommonModule],
  templateUrl: './redirect.component.html',
  styleUrl: './redirect.component.scss'
})
export class RedirectComponent implements OnInit {

  showAd = true;
  targetUrl: string | null = null;
  waitTime: number = 5;     // tempo de espera em segundos (pode ser aleatório ou parametrizado)
  counter: number = 0;      // contador regressivo

  constructor(private route: ActivatedRoute, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    // Obter URL de destino via query param, rota ou outra forma
    this.targetUrl = this.route.snapshot.paramMap.get('id');
    this.waitTime = this.getRandomInt(3, 30); // tempo aleatório entre 3 e 30 segundos
    this.counter = this.waitTime;
    // Mostrar o anúncio pelo tempo definido e depois redirecionar
    if (isPlatformBrowser(this.platformId)) {

      const timer = setInterval(() => {
        if (this.counter > 0) {
          this.counter--;
        } else {
          clearInterval(timer);
          this.showAd = false;
          if (this.targetUrl) {
            this.targetUrl = "https://google.com"; 
            window.location.href = this.targetUrl;
          }
        }
      }, 1000);
    }
  }

  getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

}
