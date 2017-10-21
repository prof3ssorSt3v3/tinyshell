/*!
 * tinyshell.js
 * Copyright (c) 2017 Steve Griffith
 * https://github.com/prof3ssorSt3v3/TinyShell/
 * Released under MIT license
 * Limited Use scenario - this is intended to be used in mobile devices only
 * @version 0.0.2
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
            eventType:null,
            maxTime: 200, 
            minDistance:25
        };
        this.Events = {
            swipeleft: new CustomEvent('swipeleft', 
                                       {detail:{
                                           dir:'left', 
                                           points:1
                                       }}),
            swiperight: new CustomEvent('swiperight', 
                                       {detail:{
                                           dir:'right', 
                                           points:1
                                       }}),
            tap: new CustomEvent('tap', 
                                 {detail:{
                                     points:1
                                 }})
        };
    }
    
    t$.prototype.addEventListener = function(ev, callback){
        this.Params.targets.forEach(addEvs.bind(this));
        function addEvs(t){
            t.addEventListener(ev, callback);
            this.Params.eventType = ev;
            t.addEventListener('touchstart', this.start.bind(this), {capture:true, passive:true});
            t.addEventListener('touchend', this.end.bind(this), {capture:true, passive:true});
            t.addEventListener('touchcancel', this.cancel.bind(this), {capture:true});
        }
    }
    
    t$.prototype.start = function (ev){
        let touches = ev.changedTouches;
        if(touches.length == 1){
            this.Params.startX = touches[0].pageX;
            this.Params.startY = touches[0].pageY;
            performance.mark('start'); 
        }
    }
    
    t$.prototype.end = function (ev){
        let touches = ev.changedTouches;
        if(touches.length == 1){
            performance.mark('end');
            performance.measure('touching','start','end');
            let m = performance.getEntriesByName('touching', 'measure');
            let duration = m[0].duration;
            //performance.clearMeasures('touching');
            //performance.clearMarks('start');
            //performance.clearMarks('end');
            let deltaX;
            let deltaY = Math.abs(touches[0].pageY - this.Params.startY);
            //TODO: Handle both eventTypes on the same object
            //TODO: Handle the tap event
            if(this.Params.eventType == 'swipeleft'){
                deltaX = this.Params.startX - touches[0].pageX;
            }else if(this.Params.eventType == 'swiperight'){
                deltaX = touches[0].pageX - this.Params.startX;
            }
            if( deltaX > this.Params.minDistance && duration < this.Params.maxTime){
                //Good swipe
                console.log('Successful', this.Params.eventType);
                //do callback
                ev.currentTarget.dispatchEvent(this.Events[this.Params.eventType]);
            }else{
                //invalid swipe
                console.log('Invalid', this.Params.eventType);
            }
        }
    }
    
    t$.prototype.cancel = function (ev){
        console.log('cancel');
        performance.clearMarks('start');
    }
    
    t$.prototype.clear = function (ev, callback){
        console.log('clear');
        this.Params.targets.forEach(removeEvs.bind(this));
        function removeEvs(t){
            t.removeEventListener(ev, callback);
            t.removeEventListener('touchstart', this.start);
            t.removeEventListener('touchend', this.end);
            t.removeEventListener('touchcancel', this.cancel);
        }
    }
    
    return t$;
}));