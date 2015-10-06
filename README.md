keep-posted
===========

Event emitting done the simplest, functional way. No silly strings to pass around. Only functions.

Actually *keep-posted* resembles more [Signal](https://github.com/millermedeiros/js-signals/wiki/Comparison-between-different-Observer-Pattern-implementations#signals) than [EventEmitter](https://github.com/millermedeiros/js-signals/wiki/Comparison-between-different-Observer-Pattern-implementations#event-emittertargetdispatcher) pattern but anyway. You can give it a try. For me this little piece of code gets job done faster and in less error-prone fashion than any other, more complicated PubSub/EventEmitter pattern.

## Installation
```
npm install keep-posted
```
Or just grap `keep-posted.js` file from this repo (it's UMD).

## Basic Usage
```js
var keepPosted = require('keep-posted');

// Create an instance
var somethingHappened = keepPosted.create();

// Attach event listener
var unsubscribe = somethingHappened.subscribe(function (a, b, c) {
    console.log('Event!', a, b, c);
});

// Just call the function to trigger the event.
// Pass as many arguments as you like.
somethingHappened(1, 2, 3);

// Call the function returned to you when you did the subscribe
// to stop listening on that event.
unsubscribe();
```

## Intended Usage in Modules
```js
var sillyStoreModule = function () {
    var keepPosted = requite('keep-posted');
    var store = [];

    // One keep-posted instance is for only one event type.
    // Create more instances if you need to support more event types.
    var newStuffAdded = keepPosted.create();
    var storeCapacityReached = keepPosted.create();

    var addStuff = function (stuff) {
        if (store.length < 99) {
            store.push(stuff);
            newStuffAdded(stuff);
        } else {
            storeCapacityReached();
        }
    };

    return {
        addStuff: addStuff,
        onNewStuffAdded: newStuffAdded.subscribe,
        onStoreFull: storeCapacityReached.subscribe,
    }
};

var store = sillyStoreModule();

store.onNewStuffAdded(function (stuff) {
    console.log('New stuff added:', stuff);
});

store.onStoreFull(function () {
    console.log("Can't store more!");
});

store.addStuff('abc');
```

## API

### keepPosted.create([options])

Creates *keep-posted* instance.

**Parameters:**  
`options` - object with possible fields:  
* `onFirstSubscriber` - function called when first subscriber registers (e.g. hook for lazy instantiation).
* `onEveryoneUnsubscribed` - function called when all subscribers have unregistered (e.g. hook for destroying what has been constructed with lazy instantiation).

**Returns:**  
Fresh instance of *keepPosted*, on which you can call...


### keepPostedInstance([params...])

Triggers the event.

**Parameters:**  
`params...` - any number of parameters which will be passed to all listeners.


### keepPostedInstance.subscribe([options], callback)

Registers new subscriber (event listener).

**Parameters:**  
`options` - (optional) lets you pass config object for this listener. Possible options:
* `refireMostRecent` - (default: false) - when set to true will re-send to this new subscriber most recent event which happened before this subscriber jumped on board (if no even happened before still will fire with `undefined`).

`callback` - well... you know what it does.

**Returns:**  
Unsubscribe trigger. A `function` which you can call when you don't want to listen to that event anymore.


# License

The MIT License (MIT)

Copyright (c) 2015 Jakub Szwacz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
