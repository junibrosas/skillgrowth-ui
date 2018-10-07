import { Observable, Subject } from 'rxjs';
import { AppState } from './../../reducers/index';
import { Store } from '@ngrx/store';
import { Component, Output, EventEmitter } from '@angular/core';

import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { COMMON_RESET_LISTGRID } from '../../actions/common.actions';
import { IListGridItem, IListItem } from './../../types/common.types';

@Component({
    selector: 'app-list-grid',
    styles: [],
    template: `<mat-list class="list-grid">
        <div *ngFor="let item of listGrid; trackBy: trackByFn; let i = index;">
            <mat-list-item class="list-grid-item">
                <div class="list-grid-item-name mat-list-text clickable" (click)="onSelectItem(item.id)">{{item.name}}</div>
                <div class="item-desc" *ngIf="item.description">{{item.description}}</div>
                <button mat-icon-button class="pull-right" [matMenuTriggerFor]="listGridMenu" (click)="onSelectMenu(item.id)">
                    <mat-icon>more_vert</mat-icon>
                </button>
            </mat-list-item>
            <mat-divider></mat-divider>
        </div>
    </mat-list>
    <mat-menu #listGridMenu="matMenu">
        <button mat-menu-item (click)="onEditItem()">
            <mat-icon>edit</mat-icon>
            <span>Edit</span>
        </button>
        <button mat-menu-item (click)="onDeleteItem()">
            <mat-icon>delete</mat-icon>
            <span>Delete</span>
        </button>
    </mat-menu>
    <div class="alert alert-info" *ngIf="listGrid.length <= 0">No records found.</div>`
})

export class ListGridComponent implements OnDestroy {
    @Output() selectedItem = new EventEmitter<number>();
    @Output() deleteItem = new EventEmitter<number>();
    @Output() editItem = new EventEmitter<number>();

    private listGrid$: Observable<IListItem[]>;
    private listGrid: IListItem[];
    private checkAll = false;
    private destroyed$: Subject<any> = new Subject<any>();
    private itemId: number;

    constructor(
        private store: Store<AppState>
    ) {
        this.listGrid$ = this.store.select(state => state.common.listGrid);
        this.listGrid$.subscribe(grid => {
            this.listGrid = grid;
        });
    }

    onSelectMenu(id: number) {
        this.itemId = id;
    }

    onSelectItem(id: number) {
        this.selectedItem.emit(id);
    }

    onEditItem() {
        this.editItem.emit(this.itemId);
    }

    onDeleteItem() {
        this.deleteItem.emit(this.itemId);
    }

    ngOnDestroy() {
        this.destroyed$.next();
        this.store.dispatch({ type: COMMON_RESET_LISTGRID });
    }

    trackByFn(index, item) {
        return index;
    }

    private getSelectedItems(items: IListGridItem[]): IListGridItem[] {
        return items.filter(item => item.checked);
    }
}
