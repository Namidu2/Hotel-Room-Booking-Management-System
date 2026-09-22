import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { RoomTypeService } from '../../../core/services/room-type.service';

@Component({
  selector: 'app-room-type-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './room-type-form.component.html',
  styleUrl: './room-type-form.component.scss'
})
export class RoomTypeFormComponent implements OnInit {
  roomTypeForm: FormGroup;
  isEditMode = false;
  roomTypeId?: number;
  loading = false;
  submitted = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private roomTypeService: RoomTypeService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.roomTypeForm = this.fb.group({
      type_name: ['', Validators.required],
      description: [''],
      capacity: [2, [Validators.required, Validators.min(1)]],
      price_per_night: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.roomTypeId = this.route.snapshot.params['id'] ? Number(this.route.snapshot.params['id']) : undefined;
    if (this.roomTypeId) {
      this.isEditMode = true;
      this.loadRoomType();
    }
  }

  loadRoomType() {
    this.loading = true;
    this.roomTypeService.getRoomType(this.roomTypeId!).subscribe({
      next: (rt) => {
        this.roomTypeForm.patchValue(rt);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load room type details';
        this.loading = false;
      }
    });
  }

  get f() { return this.roomTypeForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.error = '';

    if (this.roomTypeForm.invalid) {
      return;
    }

    this.loading = true;
    const rtData = this.roomTypeForm.value;

    if (this.isEditMode) {
      this.roomTypeService.updateRoomType(this.roomTypeId!, rtData).subscribe({
        next: () => {
          this.router.navigate(['/room-types']);
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to update room type';
          this.loading = false;
        }
      });
    } else {
      this.roomTypeService.createRoomType(rtData).subscribe({
        next: () => {
          this.router.navigate(['/room-types']);
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to create room type';
          this.loading = false;
        }
      });
    }
  }
}
