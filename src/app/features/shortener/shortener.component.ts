import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { Clipboard } from '@angular/cdk/clipboard';
import { Router, RouterModule } from '@angular/router';
import { QrCodeDialogComponent } from '../../shared/components/qrcode-dialog/qrcode-dialog.component';
import { StatisticsDialogComponent } from '../../shared/components/statistics-dialog/statistics-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ShortenerService } from '../../shared/services/shortener.service';


@Component({
  standalone: true,
  selector: 'app-shortener',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    RouterModule
  ],
  templateUrl: './shortener.component.html',
  styleUrl: './shortener.component.scss'
})
export class ShortenerComponent {
  urlControl = new FormControl('', [Validators.required]);

  result: {
    urlEncurtada: string;
  } | null = null;

  constructor(
    private router: Router,
    private clipboard: Clipboard,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private shortenerService: ShortenerService,
  ) { }

  shortenUrl() {
    if (!this.urlControl.valid) return;

    this.shortenerService.shorten(this.urlControl.value!).subscribe({
      next: (res) => {
        this.result = {
          urlEncurtada: res.urlEncurtada
        };

        this.snackBar.open('URL encurtada com sucesso!', 'Fechar', { duration: 3000 });

        setTimeout(() => {
          document.querySelector('.result-box')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      },
      error: () => {
        this.snackBar.open('Erro ao encurtar a URL.', 'Fechar', { duration: 3000 });
      }
    });
  }

  copyToClipboard(url: string) {
    this.clipboard.copy(url);
  }

  async showQrCode(): Promise<void> {

    const url = this.result?.urlEncurtada;
    if (!url) return;
    try {
      const path = url.split('/').pop();
      if (!path) return;
      const blob = await this.shortenerService.getQrCode(path).toPromise();
      const dialogRef = this.dialog.open(QrCodeDialogComponent, {
        data: { blob, url },
        width: '400px',
        height: '400px'
      });

    } catch (err) {
      console.error('Erro ao gerar QR Code:', err);
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
