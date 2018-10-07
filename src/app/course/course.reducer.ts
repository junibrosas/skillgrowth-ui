import { Action } from '@ngrx/store';

import {
    CourseActionTypes,
    SET_COURSES,
    SET_COURSE,
    RESET_COURSE,
    COURSE_USER_SET
} from './course.actions';
import { ICourse } from './course.types';
import { AppState } from '../common/reducers/index';

export interface CourseState {
    courses: ICourse[];
    profile: ICourse;
    userCourses: ICourse[];
}

const getDefaultCourse = (): ICourse => {
    return {
        id: '',
        name: '',
        description: '',
        subjectId: '',
        modules: []
    };
};

export const initialState: CourseState = {
    courses: [],
    userCourses: [],
    profile: getDefaultCourse()
};

export function courseReducer(state = initialState, action: CourseActionTypes): CourseState {
    switch (action.type) {

        case SET_COURSES:
            return { ...state, courses: action.payload };

        case SET_COURSE:
            return { ...state, profile: action.payload };

        case COURSE_USER_SET:
            return { ...state, userCourses: action.payload };

        case RESET_COURSE:
            return { ...state, profile: { ...getDefaultCourse() } };

        default:
            return state;
    }
}

