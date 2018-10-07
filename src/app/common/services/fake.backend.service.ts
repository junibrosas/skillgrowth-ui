// import { IContribution, IEnrollment, IEnrolledModule } from './../types/common.types';
// import { IModule, ModuleStatus } from './../../module/module.types';
// import { ISubject } from './../../subject/subject.types';
// import { ICourse } from './../../course/course.types';
// import { IUser } from './../../user/user.types';
// import { Injectable } from '@angular/core';
// import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
// import { Observable, throwError, of } from 'rxjs';

// import { isNull } from 'util';
// import { IListGrid, IListItem, IRecord } from '../types/common.types';
// import * as _find from 'lodash/find';
// import { dematerialize, materialize, mergeMap, delay } from 'rxjs/operators';

// @Injectable()
// export class FakeBackendInterceptor implements HttpInterceptor {

//     constructor() {
//         const users: IUser[] = JSON.parse(localStorage.getItem('users')) || [];
//         const user = users.find(u => u.userType === 'Administrator');

//         if (!user) {
//             users.push({
//                 id: '1',
//                 email: 'admin@gmail.com',
//                 userType: 'Administrator',
//                 password: 'asdqwe',
//                 profile: {
//                     fullname: 'Super Administrator',
//                     firstname: 'Super',
//                     lastname: 'Administrator',
//                 }
//             });
//             localStorage.setItem('users', JSON.stringify(users));
//         }
//     }

//     intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

//         // array in local storage for registered users
//         const currentUser: IUser = JSON.parse(localStorage.getItem('currentUser')) || [];
//         const users: IUser[] = JSON.parse(localStorage.getItem('users')) || [];
//         const modules: IModule[] = JSON.parse(localStorage.getItem('modules')) || [];
//         const courses: ICourse[] = JSON.parse(localStorage.getItem('courses')) || [];
//         const subjects: ISubject[] = JSON.parse(localStorage.getItem('subjects')) || [];
//         const contributions: IContribution[] = JSON.parse(localStorage.getItem('contributions')) || [];
//         const enrollments: IEnrollment[] = JSON.parse(localStorage.getItem('enrollments')) || [];
//         const enrolledModules: IEnrolledModule[] = JSON.parse(localStorage.getItem('enrolledModules')) || [];

//         // wrap in delayed observable to simulate server api call
//         return of(null).pipe()mergeMap(() => {

//             // authenticate
//             if (request.url.endsWith('/api/authenticate') && request.method === 'POST') {
//                 // find if any user matches login credentials
//                 const filteredUsers = users.filter(user => {
//                     return user.email === request.body.email && user.password === request.body.password;
//                 });

//                 if (filteredUsers.length) {
//                     // if login details are valid return 200 OK with user details and fake jwt token
//                     const user = filteredUsers[0];
//                     const body: IUser = {
//                         id: user.id,
//                         email: user.email,
//                         profile: {
//                             fullname: user.profile.firstname + ' ' + user.profile.lastname,
//                             firstname: user.profile.firstname,
//                             lastname: user.profile.lastname,
//                         },
//                         userType: user.userType
//                     };

//                     localStorage.setItem('currentUser', JSON.stringify(body));
//                     return of(new HttpResponse({ status: 200, body: body }));
//                 } else {
//                     // else return 400 bad request
//                     return throwError('Email or password is incorrect');
//                 }
//             }

//             // get users
//             if (request.url.endsWith('/api/users/') && request.method === 'GET') {
//                 if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
//                     return of(new HttpResponse({ status: 200, body: users }));
//                 } else {
//                     return throwError('Unauthorised');
//                 }
//             }

//             // get user by id
//             if (request.url.match(/\/api\/users\/\d+$/) && request.method === 'GET') {
//                 if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
//                     // find user by id in users array
//                     const urlParts = request.url.split('/');
//                     const id = urlParts[urlParts.length - 1];
//                     const matchedUsers = users.filter(u => u.id === id);
//                     const user = matchedUsers.length ? matchedUsers[0] : null;

//                     return of(new HttpResponse({ status: 200, body: user }));
//                 } else {
//                     // return 401 not authorised if token is null or invalid
//                     return throwError('Unauthorised');
//                 }
//             }

//             // create user
//             if (request.url.endsWith('/api/users/') && request.method === 'POST') {
//                 // get new user object from post body
//                 const newUser = request.body;

//                 // validation
//                 const duplicateUser = users.filter(user => user.email === newUser.email).length;
//                 if (duplicateUser) {
//                     return Observable.throw('Email "' + newUser.email + '" is already taken');
//                 }

//                 // save new user
//                 newUser.id = users.length + 1;
//                 newUser.fullname = newUser.firstname + ' ' + newUser.lastname;
//                 users.push(newUser);
//                 localStorage.setItem('users', JSON.stringify(users));

//                 // respond 200 OK
//                 return of(new HttpResponse({ status: 200, body: newUser }));
//             }

//             // update user
//             if (request.url.match(/\/api\/users\/\d+$/) && request.method === 'PUT') {
//                 // get new user object from post body
//                 if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
//                     const newUser = request.body;
//                     const indexOf = users.findIndex(u => u.id === newUser.id);
//                     users[indexOf] = newUser;

//                     // update selected user
//                     localStorage.setItem('users', JSON.stringify(users));

//                     // respond 200 OK
//                     return of(new HttpResponse({ status: 200, body: newUser }));
//                 }

//                 return throwError('Unauthorised');
//             }

//             // delete user
//             if (request.url.match(/\/api\/users\/\d+$/) && request.method === 'DELETE') {
//                 if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {

//                     let urlParts = request.url.split('/');
//                     let id = urlParts[urlParts.length - 1];
//                     for (let i = 0; i < users.length; i++) {
//                         let user = users[i];
//                         if (user.id === id) {
//                             // delete user
//                             users.splice(i, 1);
//                             localStorage.setItem('users', JSON.stringify(users));
//                             break;
//                         }
//                     }

//                     // respond 200 OK
//                     return Observable.of(new HttpResponse({ status: 200 }));
//                 } else {
//                     // return 401 not authorised if token is null or invalid
//                     return Observable.throw('Unauthorised');
//                 }
//             }

//             // delete users
//             if (request.url.endsWith('/api/users/delete') && request.method === 'POST') {
//                 if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
//                     let ids = request.body;

//                     for (let index = 0; index < users.length; index++) {
//                         const element = users[index];
//                         if (ids.indexOf(element.id) !== -1) {
//                             users.splice(index, 1);
//                             index--;
//                         }
//                     }
//                     localStorage.setItem('users', JSON.stringify(users));

//                     return Observable.of(new HttpResponse({ status: 200 }));
//                 }

//                 return Observable.throw('Unauthorised');
//             }

//             // create module
//             if (request.url.endsWith('/api/module/') && request.method === 'POST') {
//                 if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
//                     // get new user object from post body
//                     let newModules = request.body;

//                     // save new user
//                     newModules.id = modules.length + 1;
//                     modules.push(newModules);
//                     localStorage.setItem('modules', JSON.stringify(modules));

//                     // respond 200 OK
//                     return Observable.of(new HttpResponse({ status: 200 }));
//                 }

//                 return Observable.throw('Unauthorised');
//             }

//             // update module
//             if (request.url.match(/\/api\/modules\/\d+$/) && request.method === 'PUT') {
//                 if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
//                     // get new user object from post body
//                     let newModule = request.body;

//                     let indexOf = modules.findIndex(u => u.id === newModule.id);
//                     modules[indexOf] = newModule;

//                     // update selected user
//                     localStorage.setItem('modules', JSON.stringify(modules));

//                     // respond 200 OK
//                     return Observable.of(new HttpResponse({ status: 200, body: newModule }));
//                 }

//                 return Observable.throw('Unauthorised');
//             }

//             // get module by id
//             if (request.url.match(/\/api\/modules\/\d+$/) && request.method === 'GET') {
//                 if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
//                     let userId = request.params.get('user');
//                     let urlParts = request.url.split('/');
//                     let id = urlParts[urlParts.length - 1];
//                     let matchedModules = modules.filter(u => { return u.id === id; });
//                     let module = matchedModules.length ? matchedModules[0] : null;
//                     let isCompleted = false;
//                     let enrolledModule = enrolledModules.find(e => e.moduleId === id && e.userId === userId);

//                     module.course = courses.find(c => c.id === module.courseId);
//                     module.course.subject = subjects.find(s => s.id === module.course.subjectId);
//                     if (enrolledModule) isCompleted = enrolledModule.isCompleted;

//                     if (isNull(module))
//                         return Observable.throw({ body: { error: 'Cannot find module object' } });

//                     return Observable.of(new HttpResponse({ status: 200, body: { module, isCompleted } }));
//                 } else {
//                     // return 401 not authorised if token is null or invalid
//                     return Observable.throw('Unauthorised');
//                 }
//             }

//             // get modules
//             if (request.url.endsWith('/api/module/') && request.method === 'GET') {
//                 if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
//                     return Observable.of(new HttpResponse({ status: 200, body: modules }));
//                 } else {
//                     // return 401 not authorised if token is null or invalid
//                     return Observable.throw('Unauthorised');
//                 }
//             }

//             // delete modules
//             if (request.url.endsWith('/api/module/delete') && request.method === 'POST') {
//                 if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
//                     let ids = request.body;

//                     for (let index = 0; index < modules.length; index++) {
//                         const element = modules[index];
//                         if (ids.indexOf(element.id) !== -1) {
//                             modules.splice(index, 1);
//                             index--;
//                         }
//                     }
//                     localStorage.setItem('modules', JSON.stringify(modules));

//                     return Observable.of(new HttpResponse({ status: 200 }));
//                 }

//                 return Observable.throw('Unauthorised');
//             }

//             // module mark as complete
//             if (request.url.endsWith('/api/module/complete') && request.method === 'POST') {
//                 if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
//                     const moduleId = request.body.moduleId;
//                     const isComplete = request.body.markAsComplete;
//                     const userId = request.body.userId;
//                     const newModules = [...modules];
//                     const moduleIndex = newModules.findIndex(m => m.id === moduleId);
//                     const module = newModules[moduleIndex];
//                     let enrolledModule = enrolledModules.find(e => e.moduleId === module.id);

//                     // insert or update enrolled module marked complete.
//                     if (enrolledModule) {
//                         const index = enrolledModules.findIndex(e => e.id === enrolledModule.id);
//                         enrolledModules[index].isCompleted = isComplete;
//                     } else {
//                         enrolledModule = {
//                             id: (enrolledModules.length + 1).toString(),
//                             userId: userId,
//                             moduleId: (module.id).toString(),
//                             isCompleted: isComplete
//                         };

//                         enrolledModules.push(enrolledModule);
//                     }

//                     localStorage.setItem('enrolledModules', JSON.stringify(enrolledModules));

//                     return Observable.of(new HttpResponse({ status: 200 }));
//                 }

//                 return Observable.throw('Unauthorised');
//             }

//             // delete course
//             if (request.url.match(/\/api\/modules\/\d+$/) && request.method === 'DELETE') {
//                 if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
//                     const urlParts = request.url.split('/');
//                     const id = urlParts[urlParts.length - 1];
//                     for (let i = 0; i < modules.length; i++) {
//                         const item = modules[i];
//                         if (item.id === id) {
//                             modules.splice(i, 1);
//                             localStorage.setItem('modules', JSON.stringify(modules));
//                             break;
//                         }
//                     }

//                     // respond 200 OK
//                     return Observable.of(new HttpResponse({ status: 200 }));
//                 } else {
//                     // return 401 not authorised if token is null or invalid
//                     return Observable.throw('Unauthorised');
//                 }
//             }

//             // get courses
//             if (request.url.endsWith('/api/course/') && request.method === 'GET') {
//                 if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
//                     let newCourses = this.mapCourses();
//                     return Observable.of(new HttpResponse({ status: 200, body: newCourses }));
//                 } else {
//                     // return 401 not authorised if token is null or invalid
//                     return Observable.throw('Unauthorised');
//                 }
//             }

//             // search courses
//             if (request.url.endsWith('/api/course/search') && request.method === 'GET') {
//                 if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
//                     let searchTerm: string = request.params.get('term');
//                     let newCourses: ICourse[] = [];
//                     if (searchTerm) {
//                         newCourses = this.mapCourses().filter(c => {
//                             return c.name.toLowerCase().indexOf(searchTerm) > -1;
//                         });
//                     } else {
//                         newCourses = this.mapCourses();
//                     }

//                     return Observable.of(new HttpResponse({ status: 200, body: { courses: newCourses } }));
//                 } else {
//                     // return 401 not authorised if token is null or invalid
//                     return Observable.throw('Unauthorised');
//                 }
//             }


//             // create course
//             if (request.url.endsWith('/api/course/') && request.method === 'POST') {
//                 if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
//                     let course = request.body;
//                     course.id = courses.length + 1;
//                     courses.push(course);
//                     localStorage.setItem('courses', JSON.stringify(courses));
//                     return Observable.of(new HttpResponse({ status: 200, body: courses }));
//                 }

//                 return Observable.throw('Unauthorised');
//             }

//             // enroll course
//             if (request.url.endsWith('/api/course/enroll') && request.method === 'POST') {
//                 if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {

//                     let userId = request.body.userId;
//                     let courseId = request.body.courseId;

//                     let enroll: IEnrollment = {
//                         id: (enrollments.length + 1).toString(),
//                         courseId,
//                         userId
//                     };

//                     enrollments.push(enroll);
//                     localStorage.setItem('enrollments', JSON.stringify(enrollments));
//                     return Observable.of(new HttpResponse({ status: 200 }));
//                 }

//                 return Observable.throw('Unauthorised');
//             }

//             // un-enroll course
//             if (request.url.match(/\/api\/courses\/enroll\/delete\/\d+$/) && request.method === 'DELETE') {
//                 if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
//                     let urlParts = request.url.split('/');
//                     let id = urlParts[urlParts.length - 1];
//                     for (let i = 0; i < enrollments.length; i++) {
//                         let item = enrollments[i];
//                         if (item.id === id) {
//                             enrollments.splice(i, 1);
//                             localStorage.setItem('enrollments', JSON.stringify(enrollments));
//                             break;
//                         }
//                     }

//                     // respond 200 OK
//                     return Observable.of(new HttpResponse({ status: 200 }));
//                 } else {
//                     // return 401 not authorised if token is null or invalid
//                     return Observable.throw('Unauthorised');
//                 }
//             }

//             // get enrolled courses by user id
//             if (request.url.match(/\/api\/courses\/enroll\/\d+$/) && request.method === 'GET') {
//                 if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
//                     let urlParts = request.url.split('/');
//                     let userId = urlParts[urlParts.length - 1];
//                     let userEnrolls = enrollments.filter(e => e.userId === userId);
//                     let userCourses = [];

//                     // retrieve user enrolled courses.
//                     userEnrolls.forEach(u => {
//                         let course = courses.find(c => c.id === u.courseId);
//                         let courseSubject = subjects.find(s => s.id === course.subjectId);
//                         userCourses.push({ ...course, subject: courseSubject });
//                     });

//                     return Observable.of(new HttpResponse({ status: 200, body: userCourses }));
//                 } else {
//                     return Observable.throw('Unauthorised');
//                 }
//             }

//             // get course by id
//             if (request.url.match(/\/api\/courses\/\d+$/) && request.method === 'GET') {
//                 let statusId: ModuleStatus = +request.params.get('status');
//                 let userId = request.params.get('user');
//                 if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
//                     let urlParts = request.url.split('/');
//                     let id = urlParts[urlParts.length - 1];
//                     let matchedCourses = courses.filter(u => { return u.id === id; });
//                     let course = matchedCourses.length ? matchedCourses[0] : null;
//                     let isEnrolled = false;

//                     // retrieve course subject
//                     course.subject = subjects.find(s => s.id === course.subjectId);

//                     // retrieve course modules
//                     course.modules = [...modules.filter(m => m.courseId === course.id)];

//                     // if has status, retrieve modules by status
//                     if (statusId) {
//                         course.modules = [...course.modules.filter(m => m.statusId === statusId)];
//                     }

//                     // if has user id, add isCompleted property per module
//                     if (userId) {
//                         let tempModules = course.modules.map(m => {
//                             // retrieve enrolled data

//                             let enrolled = enrolledModules.find(e => e.moduleId === m.id && e.userId === userId);

//                             if (enrolled) {
//                                 // mark complete
//                                 return { ...m, isCompleted: enrolled.isCompleted };
//                             }
//                             return m;
//                         });
//                         course.modules = [...tempModules];

//                         let enrollment = enrollments.find(e => e.courseId === course.id && e.userId === userId);
//                         if (enrollment)
//                             isEnrolled = true;
//                     }

//                     if (isNull(course))
//                         return Observable.throw({ body: { error: 'Cannot find course object' } });

//                     return Observable.of(new HttpResponse({ status: 200, body: { course, isEnrolled } }));
//                 } else {
//                     // return 401 not authorised if token is null or invalid
//                     return Observable.throw('Unauthorised');
//                 }
//             }

//             // update course
//             if (request.url.match(/\/api\/courses\/\d+$/) && request.method === 'PUT') {
//                 if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
//                     // get new user object from post body
//                     let obj = request.body;

//                     let indexOf = courses.findIndex(u => u.id === obj.id);
//                     courses[indexOf] = obj;

//                     localStorage.setItem('courses', JSON.stringify(courses));

//                     // respond 200 OK
//                     return Observable.of(new HttpResponse({ status: 200, body: obj }));
//                 }

//                 return Observable.throw('Unauthorised');
//             }

//             // delete course
//             if (request.url.match(/\/api\/courses\/\d+$/) && request.method === 'DELETE') {
//                 if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
//                     let urlParts = request.url.split('/');
//                     let id = urlParts[urlParts.length - 1];
//                     for (let i = 0; i < courses.length; i++) {
//                         let item = courses[i];
//                         if (item.id === id) {
//                             courses.splice(i, 1);
//                             localStorage.setItem('courses', JSON.stringify(courses));
//                             break;
//                         }
//                     }

//                     // respond 200 OK
//                     return Observable.of(new HttpResponse({ status: 200 }));
//                 } else {
//                     // return 401 not authorised if token is null or invalid
//                     return Observable.throw('Unauthorised');
//                 }
//             }

//             // delete courses
//             if (request.url.endsWith('/api/course/delete') && request.method === 'POST') {
//                 if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
//                     let ids = request.body;

//                     for (let index = 0; index < courses.length; index++) {
//                         const element = courses[index];
//                         if (ids.indexOf(element.id) !== -1) {
//                             courses.splice(index, 1);
//                             index--;
//                         }
//                     }
//                     localStorage.setItem('courses', JSON.stringify(courses));

//                     return of(new HttpResponse({ status: 200 }));
//                 }

//                 return throwError('Unauthorised');
//             }


//             // get subjects
//             if (request.url.endsWith('/api/subject/') && request.method === 'GET') {
//                 const contributorSubjects = [];
//                 const userId = request.params.get('userId');
//                 const newSubjects = subjects.map(s => {
//                     return { ...s, courses: courses.filter(c => c.subjectId === s.id) };
//                 });

//                 if (userId) {
//                     const cons = contributions.filter(c => c.userId === userId);
//                     cons.forEach(c => {
//                         const sub = newSubjects.find(s => s.id === c.subjectId);
//                         if (sub) {
//                             contributorSubjects.push(sub);
//                         }
//                     });
//                 }

//                 if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
//                     return of(new HttpResponse({ status: 200, body: userId ? contributorSubjects : newSubjects }));
//                 } else {
//                     // return 401 not authorised if token is null or invalid
//                     return throwError('Unauthorised');
//                 }
//             }

//             // create subject
//             if (request.url.endsWith('/api/subject/') && request.method === 'POST') {
//                 if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
//                     const subject = request.body;

//                     subject.id = subjects.length + 1;
//                     subjects.push(subject);

//                     const contribution: IContribution = {
//                         id: (contributions.length + 1).toString(),
//                         userId: request.body.userId,
//                         subjectId: subject.id
//                     };
//                     contributions.push(contribution);

//                     localStorage.setItem('subjects', JSON.stringify(subjects));
//                     localStorage.setItem('contributions', JSON.stringify(contributions));
//                     return Observable.of(new HttpResponse({ status: 200, body: subjects }));
//                 }

//                 return Observable.throw('Unauthorised');
//             }


//             // get subject by id
//             if (request.url.match(/\/api\/subjects\/\d+$/) && request.method === 'GET') {
//                 if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
//                     // find user by id in users array
//                     const urlParts = request.url.split('/');
//                     const id = urlParts[urlParts.length - 1];
//                     const matchedSubjects = subjects.filter(u => { return u.id === id; });
//                     const subject = matchedSubjects.length ? matchedSubjects[0] : null;

//                     let newCourses = courses.map(c => {
//                         return { ...c, modules: modules.filter(m => m.courseId === c.id) };
//                     });

//                     subject.courses = newCourses.filter(course => course.subjectId === subject.id);

//                     if (isNull(subject))
//                         return Observable.throw({ body: { error: 'Cannot find subject object' } });

//                     return Observable.of(new HttpResponse({ status: 200, body: subject }));
//                 } else {
//                     // return 401 not authorised if token is null or invalid
//                     return Observable.throw('Unauthorised');
//                 }
//             }


//             // update subject
//             if (request.url.match(/\/api\/subjects\/\d+$/) && request.method === 'PUT') {
//                 if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
//                     // get new user object from post body
//                     let obj = request.body;

//                     let indexOf = subjects.findIndex(u => u.id === obj.id);
//                     subjects[indexOf] = obj;

//                     localStorage.setItem('subjects', JSON.stringify(subjects));

//                     // respond 200 OK
//                     return Observable.of(new HttpResponse({ status: 200, body: subjects }));
//                 }

//                 return Observable.throw('Unauthorised');
//             }

//             // delete subject
//             if (request.url.match(/\/api\/subjects\/\d+$/) && request.method === 'DELETE') {
//                 if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
//                     let urlParts = request.url.split('/');
//                     let subjectId = urlParts[urlParts.length - 1];

//                     // Delete subject
//                     for (let i = 0; i < subjects.length; i++) {
//                         let item = subjects[i];
//                         if (item.id === subjectId) {
//                             subjects.splice(i, 1);
//                             localStorage.setItem('subjects', JSON.stringify(subjects));
//                             break;
//                         }
//                     }

//                     // Delete contribution
//                     for (let i = 0; i < contributions.length; i++) {
//                         let item = contributions[i];
//                         if (item.subjectId === subjectId && item.userId === currentUser.id) {
//                             contributions.splice(i, 1);
//                             localStorage.setItem('contributions', JSON.stringify(contributions));
//                             break;
//                         }
//                     }

//                     // respond 200 OK
//                     return Observable.of(new HttpResponse({ status: 200 }));
//                 } else {
//                     // return 401 not authorised if token is null or invalid
//                     return Observable.throw('Unauthorised');
//                 }
//             }

//             // delete subjects
//             if (request.url.endsWith('/api/subject/delete') && request.method === 'POST') {
//                 if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
//                     let ids = request.body;

//                     for (let index = 0; index < subjects.length; index++) {
//                         const element = subjects[index];
//                         if (ids.indexOf(element.id) !== -1) {
//                             subjects.splice(index, 1);
//                             index--;
//                         }
//                     }
//                     localStorage.setItem('subjects', JSON.stringify(subjects));

//                     return Observable.of(new HttpResponse({ status: 200 }));
//                 }

//                 return Observable.throw('Unauthorised');
//             }

//             // upload image
//             if (request.url.endsWith('/api/image-upload/') && request.method === 'POST') {
//                 let file = request.body;
//                 console.log(file);

//                 return Observable.of(new HttpResponse({ status: 200 }));
//             }

//             // pass through any requests not handled above
//             return next.handle(request);

//         })

//             .materialize()
//             .delay(500)
//             .dematerialize();
//     }

//     mapCourses(): ICourse[] {
//         let courses: ICourse[] = JSON.parse(localStorage.getItem('courses')) || [];
//         let enrollments: IEnrollment[] = JSON.parse(localStorage.getItem('enrollments')) || [];
//         let subjects: ISubject[] = JSON.parse(localStorage.getItem('subjects')) || [];
//         let currentUser: IUser = JSON.parse(localStorage.getItem('currentUser')) || [];

//         return courses.map(c => {
//             let course = { ...c, isEnrolled: false };

//             // mark course if enrolled
//             let userEnrollments = enrollments.filter(e => e.userId === currentUser.id);

//             userEnrollments.forEach(ue => {
//                 if (c.id === ue.courseId)
//                     course = { ...course, isEnrolled: true };
//             });

//             // prepend subject data
//             let courseSubject = subjects.find(s => s.id === c.subjectId);
//             if (courseSubject)
//                 return { ...course, subject: courseSubject };
//             else return course;
//         });
//     }
// }

// export let fakeBackendProvider = {
//     // use fake backend in place of Http service for backend-less development
//     provide: HTTP_INTERCEPTORS,
//     useClass: FakeBackendInterceptor,
//     multi: true
// };
