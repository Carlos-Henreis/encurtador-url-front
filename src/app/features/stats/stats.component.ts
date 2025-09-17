import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { ShortenerService } from '../../shared/services/shortener.service';
import { Title, Meta } from '@angular/platform-browser';
import { ReCaptchaConfigService } from '../../shared/services/recaptcha-config.service';
import { ErrorComponent } from '../../shared/components/error/error.component';
import { MatDialog } from '@angular/material/dialog';
import { QrCodeDialogComponent } from '../../shared/components/qrcode-dialog/qrcode-dialog.component';


@Component({
  standalone: true,
  selector: 'app-stats',
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    ErrorComponent
  ],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss'
})
export class StatsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  constructor(
    private shortenerService: ShortenerService,
    private title: Title,
    private meta: Meta,
    private recaptcha: ReCaptchaConfigService,
    private dialog: MatDialog
  ) {}

  stats: any;
  loading = true;
  error = false;

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    let token = '';
    if (!id) {
      this.router.navigateByUrl('/');
      return;
    }
    try {
      await this.recaptcha.init('recaptcha-container'); // invisível
      token = await this.recaptcha.execute();
    } catch (error) {
      this.error = true;
      this.loading = false;
      return;
    }
    this.shortenerService.getStatistics(id, token).subscribe({
      next: (res) => {
        this.stats = res.body!;
        this.loading = false;
      },
      error: (err) => {
        this.error = true;
        this.loading = false;
      }
    });

    this.title.setTitle(`Estatísticas do link ${id} - chr.app.br`);
    this.meta.addTags([
      { name: 'description', content: `Veja os acessos e QR Code do link curto ${id}.` },
      { name: 'keywords', content: `link ${id}, estatísticas de link, qr code, encurtador` },
      { property: 'og:title', content: `Estatísticas de ${id} | chr.app.br` },
      { property: 'og:description', content: `Link ${id} encurtado com relatórios de acesso.` },
      { property: 'og:url', content: `https://encurtadorurl.cahenre.com.br/stats/${id}` },
      { property: 'og:image', content: `https://encurtadorurl.cahenre.com.br/screenshot.png` },
      { property: 'og:type', content: 'website' },
      { property: 'twitter:title', content: `Estatísticas de ${id} | chr.app.br` },
      { property: 'twitter:description', content: `Link ${id} encurtado com relatórios de acesso.` },
      { property: 'twitter:image', content: `https://encurtadorurl.cahenre.com.br/screenshot.png` },
      { property: 'twitter:url', content: `https://encurtadorurl.cahenre.com.br/stats/${id}` },
      { name: 'twitter:card', content: 'summary' }
    ]);
  }

  voltar(): void {
    this.router.navigateByUrl('/');
  }

  async showQrCode() {
  
      const url = this.stats?.urlEncurtada;
      if (!url) {
        return;
      }
      try {
          const dialogRef = this.dialog.open(QrCodeDialogComponent, {
            data: { url },
            width: '400px',
            height: '400px'
          });
      } catch (err) {
        console.error('Erro ao abrir diálogo de QR Code:', err);
      }
    }
}
