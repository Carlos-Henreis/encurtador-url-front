import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { ShortenerService } from '../../shared/services/shortener.service';


@Component({
  standalone: true,
  selector: 'app-stats',
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss'
})
export class StatsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  constructor(private shortenerService: ShortenerService) {}

  stats: any;
  loading = true;
  error = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigateByUrl('/');
      return;
    }
    this.shortenerService.getStatistics(id).subscribe({
      next: (res) => {
        this.stats = res;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erro ao carregar as estatísticas.';
        this.loading = false;
      }
    });
  }

  voltar(): void {
    this.router.navigateByUrl('/');
  }
}
