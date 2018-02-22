'use strict';

/* @licence tinyshell.js
 * Copyright (c) 2017 Steve Griffith
 * https://github.com/prof3ssorSt3v3/TinyShell/
 * Released under MIT license
 * Limited Use scenario - this is intended to be used in mobile devices
 * in combination with the Cordova Framework only
 * @version 0.0.7
 */

(function (global, factory) {
    'use strict';

    global.t$ = factory(global, global.document);
})(window, function (window, document) {
    'use strict';

    //when calling "new t$(targets)" this will run
    //returns the tinyShell object which will contain the targets 
    //Array  t$.Params.targets
    //and the Events Object
    // t$.Events.swipeleft, t$.Events.swiperight, and t$.Events.tap
    //Each Event object can hold a callback

    function t$(_target) {
        //check for touch enabled device before bothering...
        if ('ontouchstart' in window) {
            console.log('TinyShell is supported');
        } else {
            console.log('Sorry. Your browser does not support Tap or Swipe.');
            return {
                addEventListener: function addEventListener() {
                    this.message();
                },
                removeTarget: function removeTarget() {
                    this.message();
                },
                addTarget: function addTarget() {
                    this.message();
                },
                message: function message() {
                    console.log('Sorry. Your browser does not support TinyShell.');
                }
            };
        }
        var targets = [];
        if (_target.length) {
            targets = Array.from(_target);
        } else {
            targets = [_target];
        }
        this.Params = {
            targets: targets,
            startX: 0,
            startY: 0,
            moved: false,
            duration: 0,
            maxSwipeTime: 300,
            minDistance: 25,
            maxDistance: 20,
            hasTouchListeners: false
        };
        this.Events = {
            swipeleft: new CustomEvent('swipeleft', { detail: {
                    dir: 'left',
                    touches: 1,
                    callback: null
                } }),
            swiperight: new CustomEvent('swiperight', { detail: {
                    dir: 'right',
                    touches: 1,
                    callback: null
                } }),
            tap: new CustomEvent('tap', { detail: {
                    touches: 1,
                    callback: null
                } })
        };
    }

    t$.EventTypes = {
        SWIPELEFT: 'swipeleft',
        SWIPERIGHT: 'swiperight',
        TAP: 'tap'
    };

    t$.prototype.addEventListener = function (ev, callback) {
        //set the eventtype hold the name of the callback function
        this.Events[ev].detail.callback = callback;
        //console.log('Added listener for', ev, 'to call', callback.name );
        this.Params.targets.forEach(addEvs.bind(this));

        function addEvs(t) {
            //t is a target from this.Params.targets[]
            //ev will be 'swipeleft', 'swiperight', or 'tap'
            t.addEventListener(ev, this);
            //console.log('added', ev, 'to', t);
            //TODO: don't add the touchstart, end, or cancel more than once
            t.addEventListener('touchstart', this);
            t.addEventListener('touchend', this);
            t.addEventListener('touchcancel', this);
        }
    };

    t$.prototype.removeTarget = function (t) {
        //removes it from the Params.target array 
        //and remove ALL the event listeners from that target
        try {
            t.removeEventListener('swipeleft', this);
        } catch (e) {
            //console.log('there was no swipeleft to remove');
        }
        try {
            t.removeEventListener('swiperight', this);
        } catch (e) {
            //console.log('there was no swiperight to remove');
        }
        try {
            t.removeEventListener('tap', this);
        } catch (e) {
            //console.log('there was no tap to remove');
        }
        t.removeEventListener('touchstart', this);
        t.removeEventListener('touchend', this);
        t.removeEventListener('touchcancel', this);
        //console.log('Events removed for', t);
        this.Params.targets.filter(function (target) {
            return !target === t;
        });
    };

    t$.prototype.addTarget = function (t) {
        //add a new element to the array of targets
        //add a listener for the evType to the target
        this.Params.targets.push(t);
        var left = this.Events.swipeleft.detail.callback;
        var right = this.Events.swiperight.detail.callback;
        var tp = this.Events.tap.detail.callback;
        if (left) {
            t.addEventListener('swipeleft', left);
        }
        if (right) {
            t.addEventListener('swipeleft', right);
        }
        if (tp) {
            t.addEventListener('swipeleft', tp);
        }
        t.addEventListener('touchstart', this);
        t.addEventListener('touchend', this);
        t.addEventListener('touchcancel', this);
    };

    t$.prototype.start = function (ev) {
        var touches = ev.changedTouches;
        this.Events['tap'].detail.touches = touches.length;
        this.Events['swipeleft'].detail.touches = touches.length;
        this.Events['swiperight'].detail.touches = touches.length;
        this.Params.startX = touches[0].pageX;
        this.Params.startY = touches[0].pageY;
        performance.mark('start');
    };

    t$.prototype.end = function (ev) {
        var touches = ev.changedTouches;
        //Must be changedTouches as ev.touches.length would be zero
        if (touches.length == 1) {
            performance.mark('end');
            performance.measure('touching', 'start', 'end');
            var m = performance.getEntriesByName('touching', 'measure');
            var duration = m[0].duration;
            var deltaX = Math.max(this.Params.startX, touches[0].pageX) - Math.min(this.Params.startX, touches[0].pageX);
            var deltaY = Math.max(touches[0].pageY, this.Params.startY) - Math.min(touches[0].pageY, this.Params.startY);
            var dir = void 0;
            if (Math.max(this.Params.startX, touches[0].pageX) == this.Params.startX) {
                //start was to the right so this is a swipe left
                dir = 'left';
            } else {
                dir = 'right';
            }
            //for tap
            if (this.Events['tap'].detail.callback !== null && typeof this.Events['tap'].detail.callback === 'function') {
                if (deltaX < this.Params.maxDistance && deltaY < this.Params.maxDistance) {
                    ev.currentTarget.dispatchEvent(this.Events['tap']);
                    //stop here and don't bother with the swipes
                    //since the minDistance was not reached
                    performance.clearMarks('start');
                    performance.clearMarks('end');
                    return;
                }
            }
            //for swipeleft
            if (dir == 'left' && this.Events['swipeleft'].detail.callback !== null && typeof this.Events['swipeleft'].detail.callback === 'function') {
                if (deltaX > this.Params.minDistance && duration < this.Params.maxSwipeTime && deltaX > deltaY) {
                    console.log('Successful swipeleft'); //Good swipe
                    //do callback to be handled by this.handleEvent
                    ev.currentTarget.dispatchEvent(this.Events['swipeleft']);
                } else {
                    console.log('Invalid swipeleft', deltaX, duration); //invalid swipe
                }
                performance.clearMarks('start');
                performance.clearMarks('end');
                return;
            }
            //for swiperight
            if (dir == 'right' && this.Events['swiperight'].detail.callback !== null && typeof this.Events['swiperight'].detail.callback === 'function') {
                if (deltaX > this.Params.minDistance && duration < this.Params.maxSwipeTime && deltaX > deltaY) {
                    console.log('Successful swiperight'); //Good swipe
                    //do callback to be handled by this.handleEvent
                    ev.currentTarget.dispatchEvent(this.Events['swiperight']);
                } else {
                    console.log('Invalid swiperight', deltaX, duration); //invalid swipe
                }
                performance.clearMarks('start');
                performance.clearMarks('end');
                return;
            }
        }
    };

    t$.prototype.cancel = function (ev) {
        console.log('cancel');
        performance.clearMarks('start');
    };

    t$.prototype.clear = function (ev, callback) {
        console.log('clear');
        //clears ALL event listeners AND targets;
        this.Events[ev].detail.callback = null;
        this.Params.targets.forEach(removeEvs.bind(this));
        this.Params.hasTouchListeners = false;
        this.Params.targets = [];
        function removeEvs(t) {
            t.removeEventListener(ev, callback);
            t.removeEventListener('touchstart', this.start);
            t.removeEventListener('touchend', this.end);
            t.removeEventListener('touchcancel', this.cancel);
        }
    };

    t$.prototype.handleEvent = function (ev) {
        //console.log('handling', ev.type);
        switch (ev.type) {
            case 'swipeleft':
            case 'swiperight':
            case 'tap':
                //swipe or tap with one finger
                if (ev.detail.touches == 1) {
                    this.Events[ev.type].detail.callback.call(this, ev);
                } else {
                    console.log('Wrong number of touch points', ev.detail.touches);
                }
                break;
            case 'touchstart':
                this.start(ev);
                break;
            case 'touchend':
                this.end(ev);
                break;
            case 'touchcancel':
                this.cancel(ev);
                break;
        }
    };

    return t$;
});