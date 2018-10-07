import { IModule } from './../module/module.types';
import { IRecord } from '../common/types/common.types';
import { ISubject } from '../subject/subject.types';


export interface ICourse extends IRecord {
    subjectId: string;
    modules: IModule[];
    thumbnail?: string;
    subject?: ISubject;
    isEnrolled?: boolean;
}

export enum FilterCourse {
    All = 1,
    Enrolled = 2,
}


/**
 * Server Response Payloads
 */

export interface IPayloadCourse {
    isEnrolled: boolean;
    course: ICourse;
}

export interface IPayloadSearchCourse {
    courses: ICourse[];
}
