import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error',
  imports: [
    MatButtonModule
  ],
  templateUrl: './error.component.html',
  styleUrl: './error.component.scss'
})
export class ErrorComponent {
  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/']);
  }
}
