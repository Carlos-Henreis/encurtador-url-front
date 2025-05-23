import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-statistics-dialog',
  templateUrl: './statistics-dialog.component.html',
  styleUrls: ['./statistics-dialog.component.scss'],
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule
  ]
})
export class StatisticsDialogComponent {
  codigoControl = new FormControl('', [Validators.required]);

  constructor(private dialogRef: MatDialogRef<StatisticsDialogComponent>) {}

  confirmar(): void {
    if (this.codigoControl.valid) {
      this.dialogRef.close(this.codigoControl.value);
    }
  }

  cancelar(): void {
    this.dialogRef.close(null);
  }
}
