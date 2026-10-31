import { Routes } from '@angular/router';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage),
    title: 'Iniciar Sesión | Gestión Empresarial'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.page').then(m => m.DashboardPage),
    canActivate: [roleGuard('ADMIN')],
    title: 'Cuadro de Mando (Admin) | Gestión Empresarial'
  },
  {
    path: 'registros',
    loadComponent: () => import('./pages/registros/registros.page').then(m => m.RegistrosPage),
    canActivate: [roleGuard('STANDARD')],
    title: 'Gestión de Registros | Gestión Empresarial'
  },
  {
    path: 'ayuda',
    loadComponent: () => import('./pages/ayuda/ayuda.page').then(m => m.AyudaPage),
    title: 'Manual de Usuario & Ayuda | FP Nebrija'
  },
  {
    path: 'unauthorized',
    loadComponent: () => import('./pages/unauthorized/unauthorized.page').then(m => m.UnauthorizedPage),
    title: 'Acceso Denegado (403) | Gestión Empresarial'
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
