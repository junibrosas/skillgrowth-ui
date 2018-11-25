import { ISubject } from './subject.types';

export const SET_SUBJECTS = '[Subject]SetSubjects';
export const SET_SUBJECT = '[Subject]SetSubject';
export const RESET_SUBJECT = '[Subject]ResetSubject';
export const ADD_SUBJECT = '[Subject]AddSubject';

export type SubjectActionTypes =
    { type: '[Subject]SetSubject', payload: ISubject } |
    { type: '[Subject]SetSubjects', payload: ISubject[] } |
    { type: '[Subject]AddSubject', payload: ISubject } |
    { type: '[Subject]ResetSubject' };

