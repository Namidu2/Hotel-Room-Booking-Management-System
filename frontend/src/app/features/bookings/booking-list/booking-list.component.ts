import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookingService, Booking } from '../../../core/services/booking.service';

@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  providers: [DatePipe],
  templateUrl: './booking-list.component.html',
  styleUrl: './booking-list.component.scss'
})
export class BookingListComponent implements OnInit {
  bookings: Booking[] = [];
  loading = true;

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings() {
    this.loading = true;
    this.bookingService.getBookings().subscribe({
      next: (data) => {
        this.bookings = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load bookings', err);
        this.loading = false;
      }
    });
  }

  deleteBooking(id: number) {
    if (confirm('Are you sure you want to delete this booking?')) {
      this.bookingService.deleteBooking(id).subscribe({
        next: () => {
          this.loadBookings();
        },
        error: (err) => {
          alert('Unable to delete booking.');
          console.error(err);
        }
      });
    }
  }

  getStatusBadgeClass(status: string): string {
    switch(status) {
      case 'CONFIRMED': return 'bg-success';
      case 'PENDING': return 'bg-warning text-dark';
      case 'CHECKED_IN': return 'bg-primary';
      case 'CHECKED_OUT': return 'bg-secondary';
      case 'CANCELLED': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }
}
