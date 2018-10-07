import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { PasswordRecoveryComponent } from './password-recovery.container';

describe('Component: PasswordRecoveryComponent', () => {
    let component: PasswordRecoveryComponent;
    let fixture: ComponentFixture<PasswordRecoveryComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: []
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PasswordRecoveryComponent);
        component = fixture.componentInstance;
    });
});
