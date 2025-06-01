import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { Clipboard } from '@angular/cdk/clipboard';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { Router, RouterModule } from '@angular/router';
import { QrCodeDialogComponent } from '../../shared/components/qrcode-dialog/qrcode-dialog.component';
import { StatisticsDialogComponent } from '../../shared/components/statistics-dialog/statistics-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ShortenerService } from '../../shared/services/shortener.service';
import { Meta, Title } from '@angular/platform-browser';
import { ReCaptchaConfigService } from '../../shared/services/recaptcha-config.service';


@Component({
  standalone: true,
  selector: 'app-shortener',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatIconModule,
    RouterModule
  ],
  templateUrl: './shortener.component.html',
  styleUrl: './shortener.component.scss'
})
export class ShortenerComponent implements AfterViewInit {
  urlControl = new FormControl('', [Validators.required]);

  loadingPage = true;
  loadingResult = false;
  loadingQrCode = false;

  result: {
    urlEncurtada: string;
  } | null = null;

  constructor(
    private router: Router,
    private clipboard: Clipboard,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private shortenerService: ShortenerService,
    private recaptcha: ReCaptchaConfigService,
    private title: Title, 
    private meta: Meta,
  ) { }

  ngOnInit() {
    this.title.setTitle('Encurtador de URLs com QR Code e Estatísticas | chr.app.br');
    this.meta.addTags([
      { name: 'description', content: 'Crie links curtos, gere QR Codes e acompanhe estatísticas de acesso em tempo real com o chr.app.br.' },
      { name: 'keywords', content: 'encurtador de url, shorten link, qr code, estatísticas, links curtos, chr app' },
      { name: 'robots', content: 'index, follow' },
      { name: 'author', content: 'Carlos Henrique Reis' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      { property: 'og:title', content: 'Encurtador de URLs com QR Code e Estatísticas | chr.app.br' },
      { property: 'og:description', content: 'Crie links curtos, gere QR Codes e acompanhe estatísticas de acesso em tempo real com o chr.app.br.' },
      { property: 'og:image', content: 'https://encurtadorurl.cahenre.com.br/screenshot.png' },
      { property: 'og:url', content: 'https://encurtadorurl.cahenre.com.br' },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'Encurtador de URLs' },
      { property: 'twitter:card', content: 'summary_large_image' },
      { property: 'twitter:title', content: 'Encurtador de URLs com QR Code e Estatísticas | chr.app.br' },
      { property: 'twitter:description', content: 'Crie links curtos, gere QR Codes e acompanhe estatísticas de acesso em tempo real com o chr.app.br.' },
      { property: 'twitter:image', content: 'https://encurtadorurl.cahenre.com.br/screenshot.png' },
      { property: 'twitter:url', content: 'https://encurtadorurl.cahenre.com.br' }
    ]);
  }

  async ngAfterViewInit() {
    try {
      await this.recaptcha.init('recaptcha-container');
      this.loadingPage = false;
    } catch (error) {
      console.error('Erro ao inicializar reCAPTCHA:', error);
      this.snackBar.open('Erro ao carregar reCAPTCHA. Tente novamente mais tarde.', 'Fechar', { duration: 3000 });
      this.loadingPage = false;
    }
  }

  async shortenUrl() {
    this.loadingResult = true;
    let token: string;
    if (!this.urlControl.valid) {
      this.snackBar.open('Por favor, insira uma URL válida.', 'Fechar', { duration: 3000 });
      this.loadingResult = false;
      return;
    }
    try {
      token = await this.recaptcha.execute();
    } catch (error) {
      this.snackBar.open('Erro ao obter token do reCAPTCHA. Tente novamente.', 'Fechar', { duration: 3000 });
      this.loadingResult = false;
      return;
    }


    this.shortenerService.shorten(this.urlControl.value!, token).subscribe({
      next: (res) => {
        this.result = {
          urlEncurtada: res.body!.urlEncurtada
        };

        this.snackBar.open('URL encurtada com sucesso!', 'Fechar', { duration: 3000 });
        this.loadingResult = false;
        setTimeout(() => {
          document.querySelector('.result-box')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      },
      error: (err) => {   
        if (err.status === 400) {
          this.snackBar.open('URL inválida. Por favor, insira uma URL válida.', 'Fechar', { duration: 3000 });
        } else if (err.status === 429) {
          this.snackBar.open('Limite de requisições excedido. Tente novamente mais tarde.', 'Fechar', { duration: 3000 });
        } else if (err.status === 403) {    
          this.snackBar.open('Somente humanos podem encurtar URLs. Por favor, complete o reCAPTCHA.', 'Fechar', { duration: 3000 });
        } else {
          this.snackBar.open('Erro ao encurtar a URL.', 'Fechar', { duration: 3000 });
        }
        console.error('Erro ao encurtar URL:', err);
        this.loadingResult = false;
      }
    });
  }

  copyToClipboard(url: string) {
    this.clipboard.copy(url);
  }

  async showQrCode() {
    this.loadingQrCode = true;
    let token: string;
    try {
      token = await this.recaptcha.execute();
    } catch (error) {
      this.snackBar.open('Erro ao obter token do reCAPTCHA. Tente novamente.', 'Fechar', { duration: 3000 });
      this.loadingResult = false;
      return;
    }

    const url = this.result?.urlEncurtada;
    if (!url) {
      this.snackBar.open('Nenhuma URL encurtada disponível.', 'Fechar', { duration: 3000 });
      this.loadingQrCode = false;
      return;
    }
    try {
      const path = url.split('/').pop();
      if (!path) return;

      this.shortenerService.getQrCode(path, token).subscribe({
        next: (res) => {
          const blob = new Blob([res.body!], { type: 'image/png' });
          this.loadingQrCode = false;
          const dialogRef = this.dialog.open(QrCodeDialogComponent, {
            data: { blob, url },
            width: '400px',
            height: '400px'
          });

          this.loadingQrCode = false;
        },
        error: (err) => {
          if (err.status === 404) {
            this.snackBar.open('QR Code não encontrado para esta URL.', 'Fechar', { duration: 3000 });
          } else if (err.status === 429) {
            this.snackBar.open('Limite de requisições excedido. Tente novamente mais tarde.', 'Fechar', { duration: 3000 });
          } else if (err.status === 403) {    
            this.snackBar.open('Somente humanos podem encurtar URLs. Por favor, complete o reCAPTCHA.', 'Fechar', { duration: 3000 });
          } else {
            this.snackBar.open('Erro ao gerar QR Code.', 'Fechar', { duration: 3000 });
          }
          console.error('Erro ao obter QR Code:', err);
          this.loadingQrCode = false;
        }
      });
    } catch (err) {
      console.error('Erro ao gerar QR Code:', err);
      this.snackBar.open('Erro ao gerar QR Code.', 'Fechar', { duration: 3000 });
      this.loadingQrCode = false;
    }
  }

  openStatisticsDialog(): void {
    const dialogRef = this.dialog.open(StatisticsDialogComponent, {
      width: '300px',
    });

    dialogRef.afterClosed().subscribe((codigo: string | null) => {
      if (codigo) {
        this.router.navigate(['/stats', codigo]);
      }
    });
  }
}
