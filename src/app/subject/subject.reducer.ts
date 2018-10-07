import { SubjectActionTypes, SET_SUBJECTS, SET_SUBJECT, RESET_SUBJECT, ADD_SUBJECT } from './subject.actions';
import { ISubject } from './subject.types';

export interface SubjectState {
    subjects: ISubject[];
    profile: ISubject;
}

const getDefaultSubject = (): ISubject => {
    return {
        id: '',
        name: '',
        description: '',
        courses: []
    };
};

export const initialState: SubjectState = {
    subjects: [],
    profile: getDefaultSubject()
};

export function subjectReducer(state = initialState, action: SubjectActionTypes): SubjectState {
    switch (action.type) {
        case SET_SUBJECTS:
            return { ...state, subjects: action.payload };

        case SET_SUBJECT:
            return { ...state, profile: action.payload };

        case ADD_SUBJECT:
            return { ...state, subjects: [...state.subjects, action.payload] };

        case RESET_SUBJECT:
            return { ...state, profile: { ...getDefaultSubject() } };

        default:
            return state;
    }
}

