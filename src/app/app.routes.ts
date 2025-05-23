import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/shortener/shortener.component').then(m => m.ShortenerComponent)
  },
  {
    path: 'stats/:id',
    loadComponent: () => import('./features/stats/stats.component').then(m => m.StatsComponent)
  },
  { path: '**', redirectTo: '/' }
];
