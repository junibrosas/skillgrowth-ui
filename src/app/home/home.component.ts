import { ICourse } from './../dashboard/course/course.types';
import { Observable } from 'rxjs';
import { SET_COURSES } from './../dashboard/course/course.actions';
import { CommandResultService } from './../common/services/command-result.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CourseService } from './../dashboard/course/course.service';
import { AppState } from './../common/reducers/index';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    courses$: Observable<ICourse[]>;

    constructor(
        private store: Store<AppState>,
        private courseService: CourseService,
        private spinner: NgxSpinnerService,
        private commandResult: CommandResultService,
    ) {
        this.courses$ = this.store.select(state => state.course.courses);
    }

    ngOnInit() {
        this.getAllCourses();
    }

    getAllCourses() {
        this.spinner.show();
        this.courseService.getAll().subscribe(
            courses => {
                this.spinner.hide();
                this.store.dispatch({ type: SET_COURSES, payload: courses });
            },
            error => {
                this.spinner.hide();
                this.commandResult.error(error);
            }
        );
    }
}
