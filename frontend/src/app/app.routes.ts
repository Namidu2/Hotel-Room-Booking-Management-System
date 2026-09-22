import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/layout/layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { LoginComponent } from './features/auth/login/login.component';
import { authGuard } from './core/guards/auth.guard';
import { CustomerListComponent } from './features/customers/customer-list/customer-list.component';
import { CustomerFormComponent } from './features/customers/customer-form/customer-form.component';
import { RoomTypeListComponent } from './features/room-types/room-type-list/room-type-list.component';
import { RoomTypeFormComponent } from './features/room-types/room-type-form/room-type-form.component';
import { RoomListComponent } from './features/rooms/room-list/room-list.component';
import { RoomFormComponent } from './features/rooms/room-form/room-form.component';
import { BookingListComponent } from './features/bookings/booking-list/booking-list.component';
import { BookingFormComponent } from './features/bookings/booking-form/booking-form.component';
import { PaymentListComponent } from './features/payments/payment-list/payment-list.component';
import { PaymentFormComponent } from './features/payments/payment-form/payment-form.component';

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
      { path: 'room-types', component: RoomTypeListComponent },
      { path: 'room-types/add', component: RoomTypeFormComponent },
      { path: 'room-types/edit/:id', component: RoomTypeFormComponent },
      { path: 'rooms', component: RoomListComponent },
      { path: 'rooms/add', component: RoomFormComponent },
      { path: 'rooms/edit/:id', component: RoomFormComponent },
      { path: 'bookings', component: BookingListComponent },
      { path: 'bookings/add', component: BookingFormComponent },
      { path: 'bookings/edit/:id', component: BookingFormComponent },
      { path: 'payments', component: PaymentListComponent },
      { path: 'payments/add', component: PaymentFormComponent },
      { path: 'payments/edit/:id', component: PaymentFormComponent },
    ]
  },
  { path: '**', redirectTo: '' }
];
