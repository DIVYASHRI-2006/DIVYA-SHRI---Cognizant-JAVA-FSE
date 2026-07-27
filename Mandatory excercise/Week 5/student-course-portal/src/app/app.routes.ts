import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { CourseList } from './pages/course-list/course-list';
import { CourseDetail } from './pages/course-detail/course-detail';
import { StudentProfile } from './pages/student-profile/student-profile';
import { NotFound } from './pages/not-found/not-found';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [

  {
    path: '',
    component: Home
  },

  {
    path: 'courses',
    component: CourseList
  },

  {
    path: 'courses/:id',
    component: CourseDetail
  },

  {
  path: 'profile',
  canActivate: [authGuard],
  component: StudentProfile
  },
  {
  path: 'enroll',
  loadComponent: () =>
    import('./pages/enrollment-form/enrollment-form')
      .then(m => m.EnrollmentForm)
},

  {
    path: '**',
    component: NotFound
  }

];