import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  standalone: true,
  selector: 'app-qrcode-dialog',
  templateUrl: './qrcode-dialog.component.html',
  styleUrl: './qrcode-dialog.component.scss',
  imports: [CommonModule, MatDialogModule, MatButtonModule]
})
export class QrCodeDialogComponent {
  imageUrl: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { blob: Blob; url: string },
    private dialogRef: MatDialogRef<QrCodeDialogComponent>,
    private clipboard: Clipboard
  ) {
    console.log('QrCodeDialogComponent initialized with data:', data);
    this.imageUrl = URL.createObjectURL(data.blob);
  }

  close(): void {
    this.dialogRef.close();
    URL.revokeObjectURL(this.imageUrl);
  }

  download(): void {
    const a = document.createElement('a');
    a.href = this.imageUrl;
    a.download = 'qrcode.png';
    a.click();
  }

  copyUrl(): void {
    this.clipboard.copy(this.data.url);
  }

  async shareImage(): Promise<void> {
    try {
      const file = new File([this.data.blob], 'qrcode.png', { type: this.data.blob.type });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'Compartilhe esse QR Code!',
          text: this.data.url,
          files: [file]
        });
      } else {
        alert('Este navegador não suporta compartilhamento de arquivos.');
      }
    } catch (err) {
      console.error('Erro ao compartilhar imagem:', err);
      alert('Erro ao compartilhar imagem.');
    }
  }
}
