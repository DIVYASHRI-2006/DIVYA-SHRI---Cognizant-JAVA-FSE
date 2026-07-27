import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HighlightDirective } from '../../directives/highlight.directive';
import { EnrollmentService } from '../../services/enrollment.service';
import { Course } from '../../models/course.model';

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [
    CommonModule,
    HighlightDirective
  ],
  templateUrl: './student-profile.html',
  styleUrl: './student-profile.css'
})
export class StudentProfile implements OnInit {

  student = {
    name: 'Divya Shri',
    rollNo: '221345',
    department: 'CSBS',
    year: 'IV Year',
    email: 'divyashri@example.com'
  };

  enrolledCourses: Course[] = [];

  constructor(private enrollmentService: EnrollmentService) {}

  ngOnInit(): void {
    this.enrollmentService.getEnrolledCourses().subscribe(data => {
  this.enrolledCourses = data;
});
  }
}