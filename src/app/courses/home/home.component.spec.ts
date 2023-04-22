import {ComponentFixture, fakeAsync, flush, TestBed, waitForAsync} from '@angular/core/testing';
import {DebugElement} from '@angular/core';

import {HomeComponent} from './home.component';
import {CoursesModule} from '../courses.module';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {CoursesService} from '../services/courses.service';
import {setupCourses} from '../common/setup-test-data';
import {By} from '@angular/platform-browser';
import {of} from 'rxjs';
import {click} from '../common/test-utils';

describe('HomeComponent', () => {

    let fixture: ComponentFixture<HomeComponent>;
    let component: HomeComponent;
    let el: DebugElement;
    let coursesService: any;

    const beginnerCourses = setupCourses().filter(course => course.category === 'BEGINNER');
    const advancedCourses = setupCourses().filter(course => course.category === 'ADVANCED');

    beforeEach(waitForAsync(() => {

        const coursesServiceSpy = jasmine.createSpyObj('CoursesService', ['findAllCourses']);

        TestBed.configureTestingModule({
            imports: [
                CoursesModule,
                NoopAnimationsModule
            ],
            providers: [
                {provide: CoursesService, useValue: coursesServiceSpy}
            ]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(HomeComponent);
            component = fixture.componentInstance;
            el = fixture.debugElement;
            coursesService = TestBed.inject(CoursesService);
        });
    }));

    it("should create the component", () => {
        expect(component).toBeTruthy();
    });

    it("should display only beginner courses", () => {
        coursesService.findAllCourses.and.returnValue(of(beginnerCourses));
        fixture.detectChanges();
        const tabs = el.queryAll(By.css('.mdc-tab'));
        expect(tabs.length).withContext('Unexpected number of tabs found').toBe(1);
    });

    it("should display only advanced courses", () => {
        coursesService.findAllCourses.and.returnValue(of(advancedCourses));
        fixture.detectChanges();
        const tabs = el.queryAll(By.css('.mdc-tab'));
        expect(tabs.length).withContext('Unexpected number of tabs found').toBe(1);
    });

    it("should display both tabs", () => {
        coursesService.findAllCourses.and.returnValue(of(setupCourses()));
        fixture.detectChanges();
        const tabs = el.queryAll(By.css('.mdc-tab'));
        expect(tabs.length).withContext('Unexpected number of tabs found').toBe(2);
    });

    it("should display advanced courses when tab clicked - fakeAsync", fakeAsync(() => {
        coursesService.findAllCourses.and.returnValue(of(setupCourses()));
        fixture.detectChanges();
        const tabs = el.queryAll(By.css('.mdc-tab'));
        click(tabs[1]);
        fixture.detectChanges();
        flush();
        const cardTitles = el.queryAll(By.css('.mat-mdc-tab-body-active'));
        expect(cardTitles.length).withContext('Unexpected number of courses found').toBeGreaterThan(0);
        expect(cardTitles[0].nativeElement.textContent).withContext('Unexpected course title').toContain('Angular Security Course');
    }));

    it("should display advanced courses when tab clicked - waitForAsync", waitForAsync(() => {
        coursesService.findAllCourses.and.returnValue(of(setupCourses()));
        fixture.detectChanges();
        const tabs = el.queryAll(By.css('.mdc-tab'));
        click(tabs[1]);
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            console.log('called whenStable()');
            const cardTitles = el.queryAll(By.css('.mat-mdc-tab-body-active'));
            expect(cardTitles.length).withContext('Unexpected number of courses found').toBeGreaterThan(0);
            expect(cardTitles[0].nativeElement.textContent).withContext('Unexpected course title').toContain('Angular Security Course');
        });
    }));
});


