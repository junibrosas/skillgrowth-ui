import { Action } from '@ngrx/store';
import { IModule } from './module.types';

export const SET_MODULE = '[Module]SetModule';
export const SET_MODULES = '[Module]SetModules';
export const RESET_MODULE = '[Module]ResetModule';
export const MODULE_MARK_COMPLETE = '[Module]ModuleMarkAsComplete';

export type ModuleActionTypes =
    { type: '[Module]SetModule', payload: IModule } |
    { type: '[Module]SetModules', payload: IModule[] } |
    { type: '[Module]ModuleMarkAsComplete', payload: boolean } |
    { type: '[Module]ResetModule' };

