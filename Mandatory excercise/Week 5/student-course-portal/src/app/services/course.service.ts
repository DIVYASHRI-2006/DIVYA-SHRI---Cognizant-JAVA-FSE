import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, tap, catchError, retry, switchMap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Course } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private apiUrl = 'http://localhost:3000/courses';

  private staticCourses: Course[] = [
    {
      id: 1,
      name: 'Java Programming',
      code: 'CS101',
      credits: 4,
      gradeStatus: 'Completed',
      duration: '4 Months',
      fees: 15000
    },
    {
      id: 2,
      name: 'Database Management',
      code: 'CS102',
      credits: 3,
      gradeStatus: 'In Progress',
      duration: '3 Months',
      fees: 12000
    },
    {
      id: 3,
      name: 'Web Development',
      code: 'CS103',
      credits: 4,
      gradeStatus: 'Completed',
      duration: '3 Months',
      fees: 14000
    },
    {
      id: 4,
      name: 'Operating Systems',
      code: 'CS104',
      credits: 3,
      gradeStatus: 'Not Enrolled',
      duration: '4 Months',
      fees: 10000
    },
    {
      id: 5,
      name: 'Data Structures',
      code: 'CS105',
      credits: 4,
      gradeStatus: 'Completed',
      duration: '4 Months',
      fees: 13000
    }
  ];

  constructor(private http: HttpClient) {}

  /**
   * GET all courses from JSON Server using HttpClient & RxJS operators (retry, map, tap, catchError)
   */
  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl).pipe(
      retry(1),
      map((courses: Course[]) => {
        return courses.map(c => ({
          ...c,
          name: c.name.trim()
        }));
      }),
      tap(courses => console.log(`[CourseService]: Fetched ${courses.length} courses from API`)),
      catchError((error: HttpErrorResponse) => {
        console.warn('[CourseService]: API unreachable, using static fallback courses', error.message);
        return of(this.staticCourses);
      })
    );
  }

  /**
   * GET course by ID from JSON Server
   */
  getCourseById(id: number | string): Observable<Course | undefined> {
    return this.http.get<Course>(`${this.apiUrl}/${id}`).pipe(
      retry(1),
      tap(course => console.log(`[CourseService]: Fetched course ID ${id}`, course)),
      catchError(() => {
        const found = this.staticCourses.find(c => c.id == id);
        return of(found);
      })
    );
  }

  /**
   * POST new course to JSON Server
   */
  addCourse(course: Course): Observable<Course> {
    return this.http.post<Course>(this.apiUrl, course).pipe(
      tap(newCourse => {
        console.log('[CourseService]: Added new course', newCourse);
        this.staticCourses.push(newCourse);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * PUT update existing course in JSON Server
   */
  updateCourse(id: number | string, updatedCourse: Partial<Course>): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/${id}`, updatedCourse).pipe(
      tap(course => console.log(`[CourseService]: Updated course ID ${id}`, course)),
      catchError(this.handleError)
    );
  }

  /**
   * DELETE course from JSON Server
   */
  deleteCourse(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        console.log(`[CourseService]: Deleted course ID ${id}`);
        this.staticCourses = this.staticCourses.filter(c => c.id != id);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Dynamic search using switchMap
   */
  searchCourses(terms$: Observable<string>): Observable<Course[]> {
    return terms$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => {
        if (!term.trim()) {
          return this.getCourses();
        }
        return this.http.get<Course[]>(`${this.apiUrl}?q=${encodeURIComponent(term)}`).pipe(
          catchError(() => {
            const filtered = this.staticCourses.filter(c => 
              c.name.toLowerCase().includes(term.toLowerCase()) || 
              c.code.toLowerCase().includes(term.toLowerCase())
            );
            return of(filtered);
          })
        );
      })
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('[CourseService Error]:', error);
    return throwError(() => new Error(error.message || 'Server Error'));
  }
}