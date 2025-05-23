import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender 
  },
  {
    path: 'stats/:id',
    renderMode: RenderMode.Server
  },
  {
    path: '**', // 👈 isso resolve o erro
    renderMode: RenderMode.Server
  }
];
