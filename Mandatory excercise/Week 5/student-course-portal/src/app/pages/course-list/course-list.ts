import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';

import { CourseService } from '../../services/course.service';
import { EnrollmentService } from '../../services/enrollment.service';

import { Course } from '../../models/course.model';
import { CreditLabelPipe } from '../../pipes/credit-label.pipe';

import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [
    CommonModule,
    CreditLabelPipe,
    FormsModule
  ],
  templateUrl: './course-list.html',
  styleUrl: './course-list.css'
})
export class CourseList implements OnInit {

  courses: Course[] = [];
  searchTerm = '';
  private searchSubject = new Subject<string>();

  constructor(
    private courseService: CourseService,
    private enrollmentService: EnrollmentService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadCourses();

    // Use switchMap for dynamic search stream
    this.courseService.searchCourses(this.searchSubject).subscribe({
      next: (data) => this.courses = data,
      error: (err) => console.error('[CourseList]: Search failed', err)
    });

    const search = this.route.snapshot.queryParamMap.get('search');
    if (search) {
      this.searchTerm = search;
      this.onSearchInput();
    }
  }

  loadCourses(): void {
    this.courseService.getCourses().subscribe({
      next: (data) => {
        this.courses = data;
      },
      error: (err) => console.error('[CourseList]: Failed to load courses', err)
    });
  }

  onSearchInput(): void {
    this.searchSubject.next(this.searchTerm);
  }

  searchCourse(): void {
    this.searchSubject.next(this.searchTerm);
    this.router.navigate(['/courses'], { queryParams: { search: this.searchTerm } });
  }

  toggleEnrollment(courseId: number): void {
    if (this.enrollmentService.isEnrolled(courseId)) {
      this.enrollmentService.unenroll(courseId);
    } else {
      this.enrollmentService.enroll(courseId);
    }
  }

  deleteCourse(id: number): void {
    if (confirm('Are you sure you want to delete this course?')) {
      this.courseService.deleteCourse(id).subscribe({
        next: () => {
          this.loadCourses();
        },
        error: (err) => console.error('[CourseList]: Failed to delete course', err)
      });
    }
  }

  viewCourse(id: number): void {
    this.router.navigate(['/courses', id]);
  }

  isEnrolled(courseId: number): boolean {
    return this.enrollmentService.isEnrolled(courseId);
  }
}
