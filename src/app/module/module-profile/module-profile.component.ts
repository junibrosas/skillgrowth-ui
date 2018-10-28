import { CommandResultService } from './../../common/services/command-result.service';
import { IUser } from './../../user/user.types';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

import { ModuleService } from '../module.service';
import { AppState } from '../../common/reducers/index';
import { CourseService } from './../../course/course.service';
import { IModule, ModuleStatus } from './../module.types';
import { SET_MODULE, RESET_MODULE } from './../module.action';
import { BreadcrumbsService } from './../../common/components/breadcrumbs/breadcrumbs.service';
import { COMMON_BREADCRUMB_SET } from '../../common/actions/common.actions';

@Component({
    selector: 'app-module-profile',
    styleUrls: ['./module-profile.component.scss'],
    templateUrl: './module-profile.component.html'
})

export class ModuleProfileComponent implements OnDestroy, OnInit {
    moduleId: string;
    form: FormGroup;
    module: IModule;
    courseId: string;
    currentUser: IUser;
    currentUserSubscription: Subscription;
    breadcrumbsSubscription: Subscription;
    moduleSubscription: Subscription;

    constructor(
        private formBuilder: FormBuilder,
        private moduleService: ModuleService,
        private courseService: CourseService,
        private commandResult: CommandResultService,
        private breadcrumbService: BreadcrumbsService,
        private route: ActivatedRoute,
        private router: Router,
        private store: Store<AppState>,
        private spinner: NgxSpinnerService,
    ) {
        this.moduleSubscription = this.store.select(state => state.module.profile).subscribe(module => {
            this.module = module;
        });

        this.breadcrumbsSubscription = this.store.select(state => state.common.breadcrumbs).subscribe(breadcrumbs => {
            this.breadcrumbService.store(breadcrumbs);
        });

        this.currentUserSubscription = this.store.select(state => state.session.user).subscribe(user => this.currentUser = user);

        this.route.queryParams.subscribe(params => {
            this.courseId = params.courseId;
        });
        this.moduleId = this.route.snapshot.paramMap.get('id');
        this.initForm();
    }

    ngOnInit() {
        if (this.moduleId) {
            this.getModule();
        } else {
            this.getCourse();
        }
    }

    ngOnDestroy() {
        this.store.dispatch({ type: RESET_MODULE });
        this.currentUserSubscription.unsubscribe();
        this.breadcrumbsSubscription.unsubscribe();
        this.moduleSubscription.unsubscribe();
    }

    initForm() {
        this.form = this.formBuilder.group({
            name: new FormControl(this.module.name, [Validators.required]),
            description: new FormControl(this.module.description),
            course: new FormControl(this.courseId),
            statusId: new FormControl(ModuleStatus.Publish),
            isCompleted: new FormControl(false),
            dateCreated: new FormControl(new Date()),
            author: new FormControl(this.currentUser.profile.fullname)
        });
    }

    getCourse() {
        this.spinner.show();

        this.courseService.getById(this.courseId).subscribe(
            course => {
                this.spinner.hide();
                this.store.dispatch({
                    type: COMMON_BREADCRUMB_SET, payload: [
                        { label: 'Subjects', url: '/subject', params: [] },
                        { label: course.subject.name, url: '/subject/' + course.subject.id, params: [] },
                        { label: course.name, url: '/course/' + course.id, params: [] },
                        { label: 'Add New Module', url: '', params: [] }
                    ]
                });
            },
            error => {
                this.spinner.hide();
                this.commandResult.error(error);
            }
        );
    }

    getModule() {
        this.spinner.show();

        this.moduleService.getById(this.moduleId).subscribe(
            module => {
                this.spinner.hide();
                this.store.dispatch({ type: SET_MODULE, payload: module });
                this.store.dispatch({
                    type: COMMON_BREADCRUMB_SET, payload: [
                        { label: 'Subjects', url: '/subject', params: [] },
                        { label: module.course.subject.name, url: '/subject/' + module.course.subject.id, params: [] },
                        { label: module.course.name, url: `/course/${module.course.id}`, params: [] },
                        { label: module.name, url: '', params: [] }
                    ]
                });
                this.form.patchValue(module);
            },
            error => {
                this.spinner.hide();
                this.commandResult.error(error);
            }
        );
    }

    submit(draft: boolean = false) {
        if (!this.form.valid) {
            return false;
        }

        this.form.patchValue({
            statusId: draft === true ? ModuleStatus.Draft : ModuleStatus.Publish
        });

        let module = this.form.value;

        if (this.moduleId) {
            module = Object.assign({}, this.module, this.form.value);
        }

        this.createOrUpdate(module);
    }

    createOrUpdate(module: IModule) {
        this.spinner.show();

        this.moduleService.createOrUpdate(module).subscribe(
            payload => {
                this.spinner.hide();

                if (module.id) {
                    this.store.dispatch({ type: SET_MODULE, payload: payload });
                } else {
                    this.gotoParent();
                }

                this.commandResult.promptSaved();
            },
            error => {
                this.spinner.hide();
                this.commandResult.error(error);
            }
        );
    }

    gotoParent() {
        this.router.navigate(['/course', this.courseId]);
    }

    trackByFn(index, item) { return index; }

    get name() { return this.form.get('name'); }

    get description() { return this.form.get('description'); }

    get overviewUrl() { return `/module/overview/${this.moduleId}`; }
}
