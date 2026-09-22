import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer } from './customer.service';
import { Room } from './room.service';

export interface Booking {
  booking_id?: number;
  customer_id: number;
  room_id: number;
  check_in_date: string;
  check_out_date: string;
  number_of_guests: number;
  booking_status: string;
  total_amount?: number;
  created_at?: string;
  customer?: Customer;
  room?: Room;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'http://localhost:3000/api/bookings';

  constructor(private http: HttpClient) {}

  getBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.apiUrl);
  }

  getBooking(id: number): Observable<Booking> {
    return this.http.get<Booking>(`${this.apiUrl}/${id}`);
  }

  createBooking(booking: Booking): Observable<Booking> {
    return this.http.post<Booking>(this.apiUrl, booking);
  }

  updateBooking(id: number, booking: Booking): Observable<Booking> {
    return this.http.put<Booking>(`${this.apiUrl}/${id}`, booking);
  }

  deleteBooking(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
