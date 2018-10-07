import { Action } from '@ngrx/store';

import { ModuleActionTypes, SET_MODULE, RESET_MODULE, SET_MODULES, MODULE_MARK_COMPLETE } from './module.action';
import { IModule } from './module.types';
import { AppState } from '../common/reducers/index';

export interface ModuleState {
    modules: IModule[];
    profile: IModule;
}

const getDefaultModule = (): IModule => {
    return {
        id: '',
        name: '',
        description: '',
        courseId: '',
        course: null,
        statusId: 0,
        isCompleted: false,
        author: '',
        dateCreated: new Date()
    };
};

export const initialState: ModuleState = {
    modules: [],
    profile: getDefaultModule()
};

export function moduleReducer(state = initialState, action: ModuleActionTypes): ModuleState {

    switch (action.type) {

        case SET_MODULE:
            return { ...state, profile: action.payload };

        case SET_MODULES:
            return { ...state, modules: action.payload };

        case RESET_MODULE:
            return { ...state, profile: { ...getDefaultModule() } };

        case MODULE_MARK_COMPLETE:
            return { ...state, profile: { ...state.profile, isCompleted: action.payload } };

        default:
            return state;
    }
}

