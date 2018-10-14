import { COMMON_SET_LISTGRID } from './../../actions/common.actions';
import { StoreModule, Store } from '@ngrx/store';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { MatMenuModule, MatIconModule, MatListModule } from '@angular/material';

import { commonReducer } from '../../reducers/common.reducer';
import { ListGridComponent } from './list-grid.component';

describe('Component: ListGridComponent', () => {
    let component: ListGridComponent;
    let fixture: ComponentFixture<ListGridComponent>;
    let store: any;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                MatMenuModule,
                MatIconModule,
                MatListModule,
                StoreModule.forRoot({}),
                StoreModule.forFeature('common', commonReducer)
            ],
            declarations: [ListGridComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ListGridComponent);
        store = fixture.debugElement.injector.get(Store);
        component = fixture.componentInstance;

        // Populate data to store by dispatching action.
        const records = [{ id: 1, name: 'John Wick' }, { id: 2, name: 'John Weed' }];
        store.dispatch({ type: COMMON_SET_LISTGRID, payload: records });
    });

    it('should have proper headers based on header input', () => {
        fixture.detectChanges();
        const elements = fixture.nativeElement.querySelectorAll('.list-grid-item');

        expect(elements.length).toBe(2);
    });

    it('should have correct text content on list items', () => {
        fixture.detectChanges();
        const elements = fixture.nativeElement.querySelectorAll('.list-grid-item-name');

        expect(elements[0].textContent).toContain('John Wick');
        expect(elements[1].textContent).toContain('John Weed');
    });
});
