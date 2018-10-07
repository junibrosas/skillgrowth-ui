import { filter } from 'rxjs/operators';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, Params, PRIMARY_OUTLET } from '@angular/router';

import { IBreadcrumb } from './breadcrumbs.types';
import { BreadcrumbsService } from './breadcrumbs.service';

@Component({
    selector: 'app-breadcrumb',
    template: `
        <div [ngClass]="{'container-fluid': allowBootstrap, 'fluid-bread': true}">
            <div class='container'>
                <ol [ngClass]="{'breadcrumb': allowBootstrap}" class="{{addClass ? '' + addClass : ''}}">
                    <li *ngFor="let breadcrumb of breadcrumbs; trackBy: trackByFn; let last = last;"
                    [ngClass]="{ 'breadcrumb-item': allowBootstrap, 'list': true, 'active': last }">
                        <a *ngIf="!last" [routerLink]="hasParams(breadcrumb)">
                            {{breadcrumb.label}}
                        </a>
                        <span *ngIf="last">{{ breadcrumb.label }}</span>
                    </li>
                </ol>
            </div>
        </div>`,
    styles: [`
        .fluid-bread {
            background-color: white;
        }

        .breadcrumb {
            background-color: white;
            padding: 4px;
            margin-bottom: 0;
        }`],
    encapsulation: ViewEncapsulation.None
})

export class BreadcrumbComponent implements OnInit {

    // All the breadcrumbs
    public breadcrumbs: IBreadcrumb[];

    @Input()
    public allowBootstrap: boolean;

    @Input()
    public addClass: string;

    // The breadcrumbs of the current route
    private currentBreadcrumbs: IBreadcrumb[];

    public constructor(private breadcrumbService: BreadcrumbsService, private activatedRoute: ActivatedRoute, private router: Router) {
        this.breadcrumbService.get().subscribe((breadcrumbs: IBreadcrumb[]) => {
            this.breadcrumbs = breadcrumbs;
        });
    }

    public hasParams(breadcrumb: IBreadcrumb) {
        return Object.keys(breadcrumb.params).length ? [breadcrumb.url, breadcrumb.params] : [breadcrumb.url];
    }

    public ngOnInit() {
        const ROUTE_DATA_BREADCRUMB = 'breadcrumb';
        const ROUTE_PARAM_BREADCRUMB = 'breadcrumb';
        const PREFIX_BREADCRUMB = 'prefixBreadcrumb';

        // subscribe to the NavigationEnd event
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe(event => {
            // reset currentBreadcrumbs
            this.currentBreadcrumbs = [];


            // get the root of the current route
            let currentRoute: ActivatedRoute = this.activatedRoute.root;


            // set the url to an empty string
            let url = '';

            // iterate from activated route to children
            while (currentRoute.children.length > 0) {
                const childrenRoutes: ActivatedRoute[] = currentRoute.children;
                let breadCrumbLabel = '';

                // iterate over each children
                childrenRoutes.forEach(route => {
                    // Set currentRoute to this route
                    currentRoute = route;
                    // Verify this is the primary route
                    if (route.outlet !== PRIMARY_OUTLET) {
                        return;
                    }

                    const hasData = (route.routeConfig && route.routeConfig.data);
                    const hasDynamicBreadcrumb: boolean = route.snapshot.params.hasOwnProperty(ROUTE_PARAM_BREADCRUMB);

                    if (hasData || hasDynamicBreadcrumb) {


                        /*
                         Verify the custom data property 'breadcrumb'
                         is specified on the route or in its parameters.

                         Route parameters take precedence over route data
                         attributes.
                         */
                        if (hasDynamicBreadcrumb) {
                            breadCrumbLabel = route.snapshot.params[ROUTE_PARAM_BREADCRUMB].replace(/_/g, ' ');
                        } else if (route.snapshot.data.hasOwnProperty(ROUTE_DATA_BREADCRUMB)) {
                            breadCrumbLabel = route.snapshot.data[ROUTE_DATA_BREADCRUMB];
                        }

                        // Get the route's URL segment
                        const routeURL: string = route.snapshot.url.map(segment => segment.path).join('/');
                        url += `/${routeURL}`;

                        // Cannot have parameters on a root route
                        if (routeURL.length === 0) {
                            route.snapshot.params = {};
                        }


                        // Add breadcrumb
                        const breadcrumb: IBreadcrumb = {
                            label: breadCrumbLabel,
                            params: route.snapshot.params,
                            url: url
                        };

                        // Add the breadcrumb as 'prefixed'. It will appear before all breadcrumbs
                        if (route.snapshot.data.hasOwnProperty(PREFIX_BREADCRUMB)) {
                            this.breadcrumbService.storePrefixed(breadcrumb);
                        } else {
                            this.currentBreadcrumbs.push(breadcrumb);
                        }

                    }

                });

                this.breadcrumbService.store(this.currentBreadcrumbs);
            }
        });
    }

    trackByFn(index, item) {
        return index;
    }
}
