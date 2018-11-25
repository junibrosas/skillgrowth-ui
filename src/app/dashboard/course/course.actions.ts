import { Action } from '@ngrx/store';

import { ICourse } from './course.types';

export const SET_COURSES = '[Course]SetCourses';
export const SET_COURSE = '[Course]SetCourse';
export const RESET_COURSE = '[Course]ResetCourse';
export const COURSE_USER_SET = '[Course]SetUserCourses';

export type CourseActionTypes =
    { type: '[Course]SetCourse', payload: ICourse } |
    { type: '[Course]SetCourses', payload: ICourse[] } |
    { type: '[Course]SetUserCourses', payload: ICourse[] } |
    { type: '[Course]ResetCourse' };

