(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.keepPosted = factory();
    }
}(this, function () {
    'use strict';

    var create = function (options) {

        options = options || {};
        var listeners = [];
        var mostRecentFiredArguments;

        var keepPosted = function () {
            mostRecentFiredArguments = arguments;
            listeners.forEach(function (callback) {
                callback.apply(null, mostRecentFiredArguments);
            });
        };

        keepPosted.subscribe = function (subscriberOptions, callback) {

            if (typeof subscriberOptions === 'function') {
                callback = subscriberOptions;
                subscriberOptions = {};
            }

            listeners.push(callback);

            if (listeners.length === 1 && options.onFirstSubscriber) {
                options.onFirstSubscriber();
            }

            if (subscriberOptions.refireMostRecent) {
                callback.apply(null, mostRecentFiredArguments);
            }

            var unsubscribe = function () {
                listeners = listeners.filter(function (listener) {
                    return listener !== callback;
                });

                if (listeners.length === 0 && options.onEveryoneUnsubscribed) {
                    options.onEveryoneUnsubscribed();
                }
            };

            return unsubscribe;
        };

        return keepPosted;
    };

    return {
        create: create
    }
}));
