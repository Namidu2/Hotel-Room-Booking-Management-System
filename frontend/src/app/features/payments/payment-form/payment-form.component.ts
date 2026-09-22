import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { PaymentService } from '../../../core/services/payment.service';
import { BookingService, Booking } from '../../../core/services/booking.service';

@Component({
  selector: 'app-payment-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './payment-form.component.html',
  styleUrl: './payment-form.component.scss'
})
export class PaymentFormComponent implements OnInit {
  paymentForm: FormGroup;
  isEditMode = false;
  paymentId?: number;
  loading = false;
  submitted = false;
  error = '';
  
  bookings: Booking[] = [];
  paymentMethods = ['CREDIT_CARD', 'CASH', 'BANK_TRANSFER', 'PAYPAL'];
  paymentStatuses = ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'];

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private bookingService: BookingService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.paymentForm = this.fb.group({
      booking_id: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0)]],
      payment_method: ['CREDIT_CARD', Validators.required],
      payment_status: ['COMPLETED', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadBookings();
    
    this.paymentId = this.route.snapshot.params['id'] ? Number(this.route.snapshot.params['id']) : undefined;
    if (this.paymentId) {
      this.isEditMode = true;
      this.loadPayment();
    }
  }

  loadBookings() {
    this.bookingService.getBookings().subscribe({
      next: (data) => this.bookings = data,
      error: () => console.error('Failed to load bookings')
    });
  }

  loadPayment() {
    this.loading = true;
    this.paymentService.getPayment(this.paymentId!).subscribe({
      next: (payment) => {
        this.paymentForm.patchValue({
          ...payment,
          booking_id: payment.booking_id
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load payment details';
        this.loading = false;
      }
    });
  }

  // Helper method when a booking is selected to auto-fill the amount
  onBookingChange() {
    const bookingId = Number(this.paymentForm.value.booking_id);
    const selectedBooking = this.bookings.find(b => b.booking_id === bookingId);
    if (selectedBooking && selectedBooking.total_amount) {
      this.paymentForm.patchValue({
        amount: selectedBooking.total_amount
      });
    }
  }

  get f() { return this.paymentForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.error = '';

    if (this.paymentForm.invalid) {
      return;
    }

    this.loading = true;
    const formData = this.paymentForm.value;
    const payload = {
      ...formData,
      booking_id: Number(formData.booking_id),
      amount: Number(formData.amount)
    };

    if (this.isEditMode) {
      this.paymentService.updatePayment(this.paymentId!, payload).subscribe({
        next: () => {
          this.router.navigate(['/payments']);
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to update payment';
          this.loading = false;
        }
      });
    } else {
      this.paymentService.createPayment(payload).subscribe({
        next: () => {
          this.router.navigate(['/payments']);
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to create payment';
          this.loading = false;
        }
      });
    }
  }
}
