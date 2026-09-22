import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CustomerService } from '../../../core/services/customer.service';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './customer-form.component.html',
  styleUrl: './customer-form.component.scss'
})
export class CustomerFormComponent implements OnInit {
  customerForm: FormGroup;
  isEditMode = false;
  customerId?: number;
  loading = false;
  submitted = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.customerForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['']
    });
  }

  ngOnInit(): void {
    this.customerId = this.route.snapshot.params['id'] ? Number(this.route.snapshot.params['id']) : undefined;
    if (this.customerId) {
      this.isEditMode = true;
      this.loadCustomer();
    }
  }

  loadCustomer() {
    this.loading = true;
    this.customerService.getCustomer(this.customerId!).subscribe({
      next: (customer) => {
        this.customerForm.patchValue(customer);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load customer details';
        this.loading = false;
      }
    });
  }

  get f() { return this.customerForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.error = '';

    if (this.customerForm.invalid) {
      return;
    }

    this.loading = true;
    const customerData = this.customerForm.value;

    if (this.isEditMode) {
      this.customerService.updateCustomer(this.customerId!, customerData).subscribe({
        next: () => {
          this.router.navigate(['/customers']);
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to update customer';
          this.loading = false;
        }
      });
    } else {
      this.customerService.createCustomer(customerData).subscribe({
        next: () => {
          this.router.navigate(['/customers']);
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to create customer';
          this.loading = false;
        }
      });
    }
  }
}
