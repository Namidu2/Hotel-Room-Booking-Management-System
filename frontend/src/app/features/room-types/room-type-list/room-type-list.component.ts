import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RoomTypeService, RoomType } from '../../../core/services/room-type.service';

@Component({
  selector: 'app-room-type-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './room-type-list.component.html',
  styleUrl: './room-type-list.component.scss'
})
export class RoomTypeListComponent implements OnInit {
  roomTypes: RoomType[] = [];
  loading = true;

  constructor(private roomTypeService: RoomTypeService) {}

  ngOnInit(): void {
    this.loadRoomTypes();
  }

  loadRoomTypes() {
    this.loading = true;
    this.roomTypeService.getRoomTypes().subscribe({
      next: (data) => {
        this.roomTypes = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load room types', err);
        this.loading = false;
      }
    });
  }

  deleteRoomType(id: number) {
    if (confirm('Are you sure you want to delete this room type? This will fail if rooms exist under this type.')) {
      this.roomTypeService.deleteRoomType(id).subscribe({
        next: () => {
          this.loadRoomTypes();
        },
        error: (err) => {
          alert('Unable to delete room type. ' + (err.error?.message || ''));
          console.error(err);
        }
      });
    }
  }
}
