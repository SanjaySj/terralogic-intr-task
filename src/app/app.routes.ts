import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/layout.component').then(c => c.LayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./item-list/item-list.component').then(c => c.ItemListComponent),
      }
    ]
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
