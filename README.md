keep-posted
===========

Event emitting done functional way. No silly strings to pass around. Only functions.

Actually *keep-posted* resembles more [Signal](https://github.com/millermedeiros/js-signals/wiki/Comparison-between-different-Observer-Pattern-implementations#signals) than [EventEmitter](https://github.com/millermedeiros/js-signals/wiki/Comparison-between-different-Observer-Pattern-implementations#event-emittertargetdispatcher) pattern but anyway. You can give it a try. For me this little piece of code gets job done faster and in less error-prone fashion than any other, more complicated PubSub/EventEmitter pattern.

## Installation
```
npm install keep-posted
```

## Intended Usage
Can be imported via CommonJS, AMD and plain &lt;scrip&gt; tag. Here using CommonJS:
```js
var sillyModule = function () {
    var keepPosted = requite('keep-posted');

    // One instance is for only one event type. Create more
    // instances if you need to support more event types.
    var somethingHappened = keepPosted.create();
    var somethingDifferentHappened = keepPosted.create();

    var doSomething = function () {
        // Calling keep-posted instance just as function triggers
        // the event, and allows you to pass as many parameters
        // as you like.
        somethingHappened(1, 2, 3);
        somethingDifferentHappened();
    };

    return {
        doSomething: doSomething,
        // Anyone who wants to listen to events have to call
        // subscribe function with a callback.
        onSomething: somethingHappened.subscribe,
        onSomethingDifferent: somethingDifferentHappened.subscribe,
    }
};

var myModule = sillyModule();
myModule.onSomething(function (a, b, c) {
    console.log('Something happened with params:', a, b, c);
});
var unsubscribe = myModule.onSomethingDifferent(function () {
    console.log('Something different happened!');
});
myModule.doSomething();

// Don't want to listen anymore to 'onSomethingDifferent'.
unsubscribe();
```

## API

### keepPosted.create([options])

Creates *keep-posted* instance.

**Parameters:**  
`options` - `object` - with possible fields:  
* `updateNewSubscribers` - `true` or `false` (default: `false`) - when set to `true` will re-send to every new subscriber most recent event which happened before that subscriber jumped on board (if any event happened before).
* `onFirstSubscriber` - `function` - will be called when first subscriber registers (e.g. hook for lazy instantiation).
* `onEveryoneUnsubscribed` - `function` - will be called when all subscribers have unregistered (e.g. hook for destroying what has been constructed with lazy instantiation).

**Returns:**  
Fresh instance of *keepPosted*, on which you can call...


### keepPostedInstance([params...])

Triggers the event.

**Parameters:**  
`params...` - any number of parameters, passed as payload to all listeners.


### keepPostedInstance.subscribe(callback)

Registers new subscriber (event listener).

**Parameters:**  
`callback` - well... you know what it does.

**Returns:**  
Unsubscribe trigger. A `function` which you can call when don't want to listen to that event anymore.


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
