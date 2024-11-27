import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-add-post-modal',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatInputModule, ReactiveFormsModule, MatFormFieldModule, NgIf],
  templateUrl: './add-post-modal.component.html',
  styleUrl: './add-post-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AddPostModalComponent {

  addPostForm!: FormGroup;

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<AddPostModalComponent>) {
    this.addPostForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      body: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  get title() {
    return this.addPostForm.get('title');
  }

  get body() {
    return this.addPostForm.get('body');
  }

  onSubmit() {
    if (this.addPostForm.valid) {
      console.log('Form Submitted', this.addPostForm.value);
      this.dialogRef.close(this.addPostForm.value);
    } else {
      console.log('Form is not valid');
    }
  }
}
