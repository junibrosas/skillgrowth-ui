import { ICourse } from './../course/course.types';
import { IRecord } from '../../common/types/common.types';

export enum ModuleStatus {
    Draft = 0,
    Publish = 1
}

export interface IModule extends IRecord {
    statusId: ModuleStatus;
    isCompleted: boolean;
    author: string;
    dateCreated: Date;
    courseId?: string;
    course?: ICourse;
}


/**
 * Server Response Payloads
 */

export interface IPayloadModule {
    isCompleted: boolean;
    module: IModule;
}
