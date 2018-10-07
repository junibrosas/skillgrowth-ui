import { IRecord } from './common.types';
export interface IGui {
    isBusy: boolean;
}

export interface IRecord {
    id: string | number;
    name: string;
    description?: string;
}

export interface IValueRecord {
    value: string;
    label: string;
}

export interface IMenuItem {
    label: string;
    icon: string;
    link: string;
    children: IMenuItem[];
}

export interface IListGridItem {
    id: number;
    checked: boolean;
    fields: string[];
}

export interface IListGrid {
    headers: string[];
    items: IListGridItem[];
}

export interface IListItem extends IRecord {
    itemClass?: string;
}


/**
 * Backend Types
 */
export interface IContribution {
    id: string;
    userId: string;
    subjectId: string;
}

export interface IEnrollment {
    id: string;
    userId: string;
    courseId: string;
}

export interface IEnrolledModule {
    id: string;
    userId: string;
    moduleId: string;
    isCompleted: boolean;
}
