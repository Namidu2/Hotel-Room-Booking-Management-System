import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/layout/layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { LoginComponent } from './features/auth/login/login.component';
import { authGuard } from './core/guards/auth.guard';
import { CustomerListComponent } from './features/customers/customer-list/customer-list.component';
import { CustomerFormComponent } from './features/customers/customer-form/customer-form.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'customers', component: CustomerListComponent },
      { path: 'customers/add', component: CustomerFormComponent },
      { path: 'customers/edit/:id', component: CustomerFormComponent },
    ]
  },
  { path: '**', redirectTo: '' }
];
