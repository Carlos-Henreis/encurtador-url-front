import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Clipboard } from '@angular/cdk/clipboard';
import { QRCodeComponent } from 'angularx-qrcode';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';


@Component({
  standalone: true,
  selector: 'app-qrcode-dialog',
  templateUrl: './qrcode-dialog.component.html',
  styleUrl: './qrcode-dialog.component.scss',
  imports: [CommonModule, MatDialogModule, MatButtonModule, QRCodeComponent]
})
export class QrCodeDialogComponent {

  @ViewChild('qrCodeElement') qrCodeElement!: ElementRef<HTMLCanvasElement>;
  qrCodeUrl: SafeUrl | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { blob: Blob; url: string },
    private dialogRef: MatDialogRef<QrCodeDialogComponent>,
    private clipboard: Clipboard,
    private sanitizer: DomSanitizer
  ) { }

  close(): void {
    this.dialogRef.close();
  }

  onChangeURL(url: SafeUrl): void {
    this.qrCodeUrl = url;
  }

  download(): void {
    const a = document.getElementById('download-link') as HTMLAnchorElement;
    a.download = 'qrcode.png';
    a.click();
  }

  copyUrl(): void {
    this.clipboard.copy(this.data.url);
  }

  async shareImage(): Promise<void> {
    try {
      const canvas = document.querySelector('canvas');
      if (canvas) {
        const dataURL = canvas.toDataURL('image/png');
        const blob = await (await fetch(dataURL)).blob();
        const file = new File([blob], 'qrcode.png', { type: 'image/png' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'Compartilhe esse QR Code!',
            text: this.data.url,
            files: [file]
          });
        } else {
          alert('Este navegador não suporta compartilhamento de arquivos.');
        }
      }
    } catch (err) {
      console.error('Erro ao compartilhar imagem:', err);
      alert('Erro ao compartilhar imagem.');
    }
  }
}
