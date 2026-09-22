import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { BookingService } from '../../../core/services/booking.service';
import { CustomerService, Customer } from '../../../core/services/customer.service';
import { RoomService, Room } from '../../../core/services/room.service';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './booking-form.component.html',
  styleUrl: './booking-form.component.scss'
})
export class BookingFormComponent implements OnInit {
  bookingForm: FormGroup;
  isEditMode = false;
  bookingId?: number;
  loading = false;
  submitted = false;
  error = '';
  
  customers: Customer[] = [];
  rooms: Room[] = [];
  statuses = ['PENDING', 'CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED'];

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
    private customerService: CustomerService,
    private roomService: RoomService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.bookingForm = this.fb.group({
      customer_id: ['', Validators.required],
      room_id: ['', Validators.required],
      check_in_date: ['', Validators.required],
      check_out_date: ['', Validators.required],
      number_of_guests: [1, [Validators.required, Validators.min(1)]],
      booking_status: ['PENDING', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCustomersAndRooms();
    
    this.bookingId = this.route.snapshot.params['id'] ? Number(this.route.snapshot.params['id']) : undefined;
    if (this.bookingId) {
      this.isEditMode = true;
      this.loadBooking();
    }
  }

  loadCustomersAndRooms() {
    this.customerService.getCustomers().subscribe({
      next: (data) => this.customers = data,
      error: () => console.error('Failed to load customers')
    });
    
    this.roomService.getRooms().subscribe({
      next: (data) => this.rooms = data,
      error: () => console.error('Failed to load rooms')
    });
  }

  loadBooking() {
    this.loading = true;
    this.bookingService.getBooking(this.bookingId!).subscribe({
      next: (booking) => {
        // Format dates for input type="date" (YYYY-MM-DD)
        const checkIn = new Date(booking.check_in_date).toISOString().split('T')[0];
        const checkOut = new Date(booking.check_out_date).toISOString().split('T')[0];
        
        this.bookingForm.patchValue({
          ...booking,
          customer_id: booking.customer_id,
          room_id: booking.room_id,
          check_in_date: checkIn,
          check_out_date: checkOut
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load booking details';
        this.loading = false;
      }
    });
  }

  get f() { return this.bookingForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.error = '';

    if (this.bookingForm.invalid) {
      return;
    }

    this.loading = true;
    const formData = this.bookingForm.value;
    const payload = {
      ...formData,
      customer_id: Number(formData.customer_id),
      room_id: Number(formData.room_id)
    };

    if (this.isEditMode) {
      this.bookingService.updateBooking(this.bookingId!, payload).subscribe({
        next: () => {
          this.router.navigate(['/bookings']);
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to update booking';
          this.loading = false;
        }
      });
    } else {
      this.bookingService.createBooking(payload).subscribe({
        next: () => {
          this.router.navigate(['/bookings']);
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to create booking';
          this.loading = false;
        }
      });
    }
  }
}
