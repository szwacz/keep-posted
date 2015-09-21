'use strict';

describe('keepPosted', function () {

    var keepPosted = require('./keep-posted');

    it("can subscribe many listeners", function () {
        var count1 = 0;
        var count2 = 0;
        var kp = keepPosted.create();
        kp.subscribe(function () {
            count1 += 1;
        });
        kp.subscribe(function () {
            count2 += 1;
        });
        kp();
        expect(count1).toBe(1);
        expect(count2).toBe(1);
    });

    it("can pass as many parameters to subscribers as you like", function () {
        var args;
        var kp = keepPosted.create();
        kp.subscribe(function () {
            args = Array.prototype.slice.call(arguments);
        });
        kp(1, 2, 3, 4);
        expect(args).toEqual([1, 2, 3, 4]);
    });

    it("listener can unsubscribe", function () {
        var count1 = 0;
        var count2 = 0;
        var kp = keepPosted.create();
        var unsubscribe1 = kp.subscribe(function () {
            count1 += 1;
        });
        var unsubscribe2 = kp.subscribe(function () {
            count2 += 1;
        });
        kp();
        expect(count1).toBe(1);
        unsubscribe1();
        kp();
        expect(count1).toBe(1);
        expect(count2).toBe(2);
    });

    it("calling same unsubscribe more than once has no side effects", function () {
        var kp = keepPosted.create();
        var unsubscribe = kp.subscribe(function () {});
        unsubscribe();
        expect(function () {
            unsubscribe();
            kp();
        }).not.toThrow();
    });

    it("has onFirstSubscriber hook", function () {
        var count = 0;
        var kp = keepPosted.create({
            onFirstSubscriber: function () {
                count += 1;
            }
        });
        kp.subscribe(function () {});
        expect(count).toBe(1);
        kp.subscribe(function () {});
        // Next subscribers can't trigger the function anymore.
        expect(count).toBe(1);
    });

    it("has onEveryoneUnsubscribed hook", function () {
        var count = 0;
        var kp = keepPosted.create({
            onEveryoneUnsubscribed: function () {
                count += 1;
            }
        });
        var unsubscribe1 = kp.subscribe(function () {});
        var unsubscribe2 = kp.subscribe(function () {});
        unsubscribe1();
        expect(count).toBe(0);
        unsubscribe2();
        expect(count).toBe(1);
    });

    describe("refire last message to new subscribers", function () {

        it("refires anyway with undefined if no event was fired yet", function () {
            var kp = keepPosted.create();
            kp.subscribe({
                refireMostRecent: true
            }, function (value) {
                expect(value).toBe(undefined);
            });
        });

        it("refires", function () {
            var kp = keepPosted.create();
            kp(1, 2, 3, 4);

            kp.subscribe({
                refireMostRecent: true
            }, function () {
                var args = Array.prototype.slice.call(arguments);
                expect(args).toEqual([1, 2, 3, 4]);
            });
        });

    });

});
