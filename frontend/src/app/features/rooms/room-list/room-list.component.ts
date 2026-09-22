import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RoomService, Room } from '../../../core/services/room.service';

@Component({
  selector: 'app-room-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './room-list.component.html',
  styleUrl: './room-list.component.scss'
})
export class RoomListComponent implements OnInit {
  rooms: Room[] = [];
  loading = true;

  constructor(private roomService: RoomService) {}

  ngOnInit(): void {
    this.loadRooms();
  }

  loadRooms() {
    this.loading = true;
    this.roomService.getRooms().subscribe({
      next: (data) => {
        this.rooms = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load rooms', err);
        this.loading = false;
      }
    });
  }

  deleteRoom(id: number) {
    if (confirm('Are you sure you want to delete this room?')) {
      this.roomService.deleteRoom(id).subscribe({
        next: () => {
          this.loadRooms();
        },
        error: (err) => {
          alert('Unable to delete room.');
          console.error(err);
        }
      });
    }
  }

  getStatusBadgeClass(status: string): string {
    switch(status) {
      case 'AVAILABLE': return 'bg-success';
      case 'OCCUPIED': return 'bg-primary';
      case 'MAINTENANCE': return 'bg-warning text-dark';
      default: return 'bg-secondary';
    }
  }
}
