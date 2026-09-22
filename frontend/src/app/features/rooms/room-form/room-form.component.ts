import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { RoomService } from '../../../core/services/room.service';
import { RoomTypeService, RoomType } from '../../../core/services/room-type.service';

@Component({
  selector: 'app-room-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './room-form.component.html',
  styleUrl: './room-form.component.scss'
})
export class RoomFormComponent implements OnInit {
  roomForm: FormGroup;
  isEditMode = false;
  roomId?: number;
  loading = false;
  submitted = false;
  error = '';
  
  roomTypes: RoomType[] = [];
  statuses = ['AVAILABLE', 'OCCUPIED', 'MAINTENANCE'];

  constructor(
    private fb: FormBuilder,
    private roomService: RoomService,
    private roomTypeService: RoomTypeService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.roomForm = this.fb.group({
      room_number: ['', Validators.required],
      room_type_id: ['', Validators.required],
      floor: [''],
      status: ['AVAILABLE', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadRoomTypes();
    
    this.roomId = this.route.snapshot.params['id'] ? Number(this.route.snapshot.params['id']) : undefined;
    if (this.roomId) {
      this.isEditMode = true;
      this.loadRoom();
    }
  }

  loadRoomTypes() {
    this.roomTypeService.getRoomTypes().subscribe({
      next: (types) => this.roomTypes = types,
      error: (err) => console.error('Could not load room types')
    });
  }

  loadRoom() {
    this.loading = true;
    this.roomService.getRoom(this.roomId!).subscribe({
      next: (room) => {
        this.roomForm.patchValue({
          ...room,
          room_type_id: room.room_type_id
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load room details';
        this.loading = false;
      }
    });
  }

  get f() { return this.roomForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.error = '';

    if (this.roomForm.invalid) {
      return;
    }

    this.loading = true;
    const roomData = {
      ...this.roomForm.value,
      room_type_id: Number(this.roomForm.value.room_type_id)
    };

    if (this.isEditMode) {
      this.roomService.updateRoom(this.roomId!, roomData).subscribe({
        next: () => {
          this.router.navigate(['/rooms']);
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to update room';
          this.loading = false;
        }
      });
    } else {
      this.roomService.createRoom(roomData).subscribe({
        next: () => {
          this.router.navigate(['/rooms']);
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to create room';
          this.loading = false;
        }
      });
    }
  }
}
