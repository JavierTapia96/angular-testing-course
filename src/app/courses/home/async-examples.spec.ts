import {fakeAsync, flush, flushMicrotasks} from '@angular/core/testing';
import {Observable} from 'rxjs';

describe('Async Testing Examples', () => {

    it('Async test example with Jasmine done()', (done: DoneFn) => {
        let test = false;

        setTimeout(() => {
            console.log('running assertions');
            test = true;
            expect(test).toBeTruthy();
            done();
        }, 1000);
    });

    it('Asynchronous test example - setTimeout()', fakeAsync(() => {
        let test = false;
        setTimeout(() => {
            console.log('running assertions setTimeout()');
            test = true;
        }, 1000);
        flush();
        expect(test).toBeTruthy();
    }));

    it('Asynchronous test example - plain Promise', fakeAsync(() => {
        let test = false;
        console.log('Creating promise');
        Promise.resolve()
            .then(() => {
                console.log('Promise first then() evaluated successfully');
                return Promise.resolve();
            })
            .then(() => {
                console.log('Promise second then() evaluated successfully');
                test = true;
            });
        flushMicrotasks();
        expect(test).toBeTruthy();
    }));

    it('Asynchronous test example - Promises + setTimeout()', fakeAsync(() => {
        let counter = 0;
        Promise.resolve()
            .then(() => {
                counter += 10;
                setTimeout(() => {
                    counter += 1;
                }, 1000);
            });
        expect(counter).toBe(0);
        flushMicrotasks();
        expect(counter).toBe(10);
        flush();
        expect(counter).toBe(11);
    }));

    it('Asynchronous test example - Observables', fakeAsync(() => {
        let test = false;
        console.log('Creating Observable');
        const test$ = new Observable(subscriber => {
            console.log('Executing Observable');
            subscriber.next();
            subscriber.complete();
        });
        test$.subscribe(() => {
            test = true;
        });
        flushMicrotasks();
        expect(test).toBeTruthy();
    }));
});
