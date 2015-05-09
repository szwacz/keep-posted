'use strict';

module.exports.create = function (options) {

    options = options || {};
    var listeners = [];
    var mostRecentStuffToSend;

    var keepPosted = function () {
        mostRecentStuffToSend = arguments;
        listeners.forEach(function (callback) {
            callback.apply(null, mostRecentStuffToSend);
        });
    };

    keepPosted.subscribe = function (callback) {

        listeners.push(callback);

        if (listeners.length === 1 && options.onFirstSubscriber) {
            options.onFirstSubscriber();
        }

        if (options.updateNewSubscribers && mostRecentStuffToSend) {
            callback.apply(null, mostRecentStuffToSend);
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
