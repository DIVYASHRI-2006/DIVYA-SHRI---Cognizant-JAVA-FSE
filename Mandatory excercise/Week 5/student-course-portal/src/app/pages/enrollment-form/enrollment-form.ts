import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-enrollment-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './enrollment-form.html',
  styleUrl: './enrollment-form.css'
})
export class EnrollmentForm {

  student = {
    studentName: '',
    email: '',
    course: '',
    gender: '',
    phone: ''
  };

  submitted = false;

  onSubmit(form: any) {

    if (form.valid) {

      this.submitted = true;

      console.log(this.student);

    }

  }

}