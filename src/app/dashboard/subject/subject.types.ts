import { IRecord } from '../../common/types/common.types';
import { ICourse } from '../course/course.types';

export interface ISubject extends IRecord {
    courses: ICourse[];
    userId?: number;
}
