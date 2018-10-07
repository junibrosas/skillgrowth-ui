import { Action } from '@ngrx/store';

import { IGui, IListGrid } from '../types/common.types';
import { IListGridItem, IListItem } from './../types/common.types';
import { IBreadcrumb } from '../components/breadcrumbs/breadcrumbs.types';

export const COMMON_ENABLE_BUSY = '[Common]EnableIsBusy';
export const COMMON_DISABLE_BUSY = '[Common]DisableIsBusy';
export const COMMON_SET_LISTGRID = '[Common]ListGridSet';
export const COMMON_RESET_LISTGRID = '[Common]ListGridReset';
export const COMMON_BREADCRUMB_SET = '[Common]BreadcrumbSet';

export type CommonActionTypes =
    { type: '[Common]EnableIsBusy' } |
    { type: '[Common]DisableIsBusy' } |
    { type: '[Common]ListGridSet', payload: IListItem[] } |
    { type: '[Common]BreadcrumbSet', payload: IBreadcrumb[] } |
    { type: '[Common]ListGridReset' };
