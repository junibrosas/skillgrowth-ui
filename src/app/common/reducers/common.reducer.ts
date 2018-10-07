import { Action } from '@ngrx/store';

import {
    CommonActionTypes,
    COMMON_ENABLE_BUSY,
    COMMON_DISABLE_BUSY,
    COMMON_SET_LISTGRID,
    COMMON_RESET_LISTGRID,
    COMMON_BREADCRUMB_SET
} from '../actions/common.actions';
import { IGui, IListGrid } from '../types/common.types';
import { IBreadcrumb } from '../components/breadcrumbs/breadcrumbs.types';
import { IListItem } from './../types/common.types';

export interface CommonState extends IGui {
    breadcrumbs: IBreadcrumb[];
    listGrid: IListItem[];
}

export const initialState: CommonState = {
    isBusy: false,
    breadcrumbs: [],
    listGrid: []
};

export function commonReducer(state = initialState, action: CommonActionTypes): CommonState {

    switch (action.type) {
        case COMMON_ENABLE_BUSY:
            return { ...state, isBusy: true };

        case COMMON_DISABLE_BUSY:
            return { ...state, isBusy: false };

        case COMMON_SET_LISTGRID:
            return { ...state, listGrid: action.payload };

        case COMMON_RESET_LISTGRID:
            return { ...state, listGrid: [] };

        case COMMON_BREADCRUMB_SET:
            return { ...state, breadcrumbs: action.payload };

        default:
            return state;
    }
}
