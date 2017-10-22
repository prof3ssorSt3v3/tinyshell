/*!
 * tinyshell.js
 * Copyright (c) 2017 Steve Griffith
 * https://github.com/prof3ssorSt3v3/TinyShell/
 * Released under MIT license
 * Limited Use scenario - this is intended to be used in mobile devices only
 * @version 0.0.4
 */

(function (global, factory) {
    'use strict';
    
    global.t$ = factory(global, global.document);
    
}(window, function (window, document) {
    'use strict';
    
    function t$(_target){
        let targets = [];
        if(_target.length){
           targets = Array.from(_target);
        }else{
            targets = [_target];
        }
        this.Params = {
            targets,
            startX:0,
            startY:0,
            moved:false,
            duration:0,
            maxSwipeTime: 200, 
            minDistance:25,
            maxDistance:10
        };
        this.Events = {
            swipeleft: new CustomEvent('swipeleft', 
                                       {detail:{
                                           dir:'left', 
                                           touches:1,
                                           callback:null
                                       }}),
            swiperight: new CustomEvent('swiperight', 
                                       {detail:{
                                           dir:'right', 
                                           touches:1,
                                           callback:null
                                       }}),
            tap: new CustomEvent('tap', 
                                 {detail:{
                                     touches:1,
                                     callback:null
                                 }})
        };
    }
    
    t$.prototype.addEventListener = function(ev, callback){
        //set the eventtype hold the name of the callback function
        this.Events[ev].detail.callback = callback;
            console.log('Added listener for', ev, 'to call', callback.name );
        this.Params.targets.forEach(addEvs.bind(this));
        
        function addEvs(t){
            t.addEventListener(ev, this);
            t.addEventListener('touchstart', this);
            t.addEventListener('touchend', this);
            t.addEventListener('touchcancel', this);
        }
    }
    
    t$.prototype.start = function (ev){
        let touches = ev.changedTouches;
        this.Events['tap'].detail.touches = touches.length;
        this.Events['swipeleft'].detail.touches = touches.length;
        this.Events['swiperight'].detail.touches = touches.length;
        this.Params.startX = touches[0].pageX;
        this.Params.startY = touches[0].pageY;
        performance.mark('start'); 
    }
    
    t$.prototype.end = function (ev){
        let touches = ev.changedTouches;    
        //Must be changedTouches as ev.touches.length would be zero
        if(touches.length == 1){
            performance.mark('end');
            performance.measure('touching','start','end');
            let m = performance.getEntriesByName('touching', 'measure');
            let duration = m[0].duration;
            let deltaX = Math.max(this.Params.startX, touches[0].pageX) - Math.min(this.Params.startX, touches[0].pageX);
            let deltaY = Math.max(touches[0].pageY, this.Params.startY) - Math.min(touches[0].pageY, this.Params.startY);
            let dir;
            if( Math.max(this.Params.startX, touches[0].pageX) == this.Params.startX){
                //start was to the right so this is a swipe left
                dir = 'left';
            }else{
                dir = 'right'
            }
            //for swipeleft
            if( dir == 'left' && this.Events['swipeleft'].detail.callback !== null &&
              typeof this.Events['swipeleft'].detail.callback === 'function'){
                if( deltaX > this.Params.minDistance && 
                   duration < this.Params.maxSwipeTime && 
                   deltaX > deltaY ){
                    console.log('Successful swipeleft');//Good swipe
                    //do callback to be handled by this.handleEvent
                    ev.currentTarget.dispatchEvent(this.Events['swipeleft']);
                }else{
                    console.log('Invalid swipeleft'); //invalid swipe
                }
            }
            //for swiperight
            if( dir == 'right' && this.Events['swiperight'].detail.callback !== null &&
              typeof this.Events['swiperight'].detail.callback === 'function'){
                if( deltaX > this.Params.minDistance && 
                   duration < this.Params.maxSwipeTime && 
                   deltaX > deltaY ){
                    console.log('Successful swiperight'); //Good swipe
                    //do callback to be handled by this.handleEvent
                    ev.currentTarget.dispatchEvent(this.Events['swiperight']);
                }else{
                    console.log('Invalid swiperight');  //invalid swipe
                }
            }
            //for tap
            if( this.Events['tap'].detail.callback !== null &&
               typeof this.Events['tap'].detail.callback === 'function'){
                if( deltaX < this.Params.maxDistance && 
                  deltaY < this.Params.maxDistance){
                    ev.currentTarget.dispatchEvent(this.Events['tap']);
                }else{
                    
                }
            }
        }
    }
    
    t$.prototype.cancel = function (ev){
        console.log('cancel');
        performance.clearMarks('start');
    }
    
    t$.prototype.clear = function (ev, callback){
        console.log('clear');
        //this.Params.eventType = null;
        this.Events[ev].detail.callback = null;
        this.Params.targets.forEach(removeEvs.bind(this));
        function removeEvs(t){
            t.removeEventListener(ev, callback);
            t.removeEventListener('touchstart', this.start);
            t.removeEventListener('touchend', this.end);
            t.removeEventListener('touchcancel', this.cancel);
        }
    }
    
    t$.prototype.handleEvent = function(ev){
        switch(ev.type){
            case 'swipeleft':
            case 'swiperight':
            case 'tap':
                //swipe or tap with one finger
                if( ev.detail.touches == 1){
                    this.Events[ev.type].detail.callback.call(this, ev);
                }else{
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
    }
    
    return t$;
}));