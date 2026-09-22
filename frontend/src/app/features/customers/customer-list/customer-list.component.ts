import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CustomerService, Customer } from '../../../core/services/customer.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.scss'
})
export class CustomerListComponent implements OnInit {
  customers: Customer[] = [];
  filteredCustomers: Customer[] = [];
  searchTerm = '';
  loading = true;

  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers() {
    this.loading = true;
    this.customerService.getCustomers().subscribe({
      next: (data) => {
        this.customers = data;
        this.filteredCustomers = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load customers', err);
        this.loading = false;
      }
    });
  }

  filterCustomers() {
    if (!this.searchTerm) {
      this.filteredCustomers = this.customers;
      return;
    }
    const term = this.searchTerm.toLowerCase();
    this.filteredCustomers = this.customers.filter(c => 
      c.first_name.toLowerCase().includes(term) ||
      c.last_name.toLowerCase().includes(term) ||
      c.email.toLowerCase().includes(term) ||
      c.phone.toLowerCase().includes(term)
    );
  }

  deleteCustomer(id: number) {
    if (confirm('Are you sure you want to delete this customer?\nThis action cannot be undone.')) {
      this.customerService.deleteCustomer(id).subscribe({
        next: () => {
          this.loadCustomers();
        },
        error: (err) => {
          alert('Unable to delete customer.');
          console.error(err);
        }
      });
    }
  }
}
