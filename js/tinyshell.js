const t$ = {
            Params: {
                BOTH:'both', 
                LEFT:'left', 
                RIGHT:'right',
                maxTime: 200, 
                minDistance:25
            },
            Events: {
                callback: new Event('callback'),
                swipeleft: new CustomEvent('swipeleft', {detail:{dir:'left'}}),
                swiperight: new CustomEvent('swiperight', {detail:{dir:'right'}}),
                tap: new CustomEvent('tap', {detail:{}}),
                doubletap: new CustomEvent('doubletap', {detail:{}})
            },
            removeSwipes: (_targets)=>({
                removeSwipe:function(){
                    _targets.forEach(removeTouchListeners.bind(this));
                    function removeTouchListeners(t){
                        let swipe = this;
                        t.removeEventListener('touchstart', tstart);
                        t.removeEventListener('touchend', tend);
                        t.removeEventListener('touchcancel', tcancel);
                    }
                }
            }),
            addSwipes: (_targets)=>({
              addSwipeEvent: function(_event, _fn){
                  //use _targets here
                  //console.log(_event.detail.dir);
                  //this.dir = _event.detail.dir;
                  _targets.forEach(addTouchListeners.bind(this));
                  
                  function addTouchListeners(t){
                      let swipe = this;
                      let defaultFn = function(ev){
                          console.log(_event.type, 'completed');
                      }
                      let fn = (_fn || defaultFn);
                      t.addEventListener('callback', fn);
                      t.addEventListener('touchstart', function tstart(ev){
                          //ev.stopPropagation();
                          let touches = ev.changedTouches;
                          if(touches.length == 1){
                              //console.log(swipe.startX, swipe.endX)
                              swipe.startX = touches[0].pageX;
                              swipe.startY = touches[0].pageY;
                              swipe.endX = touches[0].pageX;
                              swipe.endY = touches[0].pageY;
                              performance.mark('start');
                              //console.log('touchstart on', ev.currentTarget); 
                          }
                      }, {capture: true, passive: true});
                      
                      t.addEventListener('touchend', function tend(ev){
                          let touches = ev.changedTouches;
                          if(touches.length == 1){
                              performance.mark('end');
                              performance.measure('touching','start','end');
                              let m = performance.getEntriesByName('touching', 'measure');
                              let duration = m[0].duration;
                              performance.clearMeasures('touching');
                              performance.clearMarks('start');
                              performance.clearMarks('end');
                              swipe.endX = touches[0].pageX;
                              swipe.endY = touches[0].pageY;
                              var deltaY = Math.abs(swipe.endY - swipe.startY);
                              if(_event.detail.dir==t$.Params.RIGHT){
                                  var deltaX = swipe.endX - swipe.startX;
                              }else if(_event.detail.dir == t$.Params.LEFT){
                                  var deltaX = swipe.startX - swipe.endX;
                              }else{
                                  //BOTH
                                  let min = Math.min(swipe.startX, swipe.endX);
                                  let max = Math.max(swipe.startX, swipe.endX);
                                  var deltaX = max - min;
                              }
                              if( deltaX > t$.Params.minDistance &&
                                  deltaX > deltaY &&
                                  duration < t$.Params.maxTime
                                ){
                                  console.log('Good SWIPE', _event.detail.dir, ev.currentTarget.tagName); 
                                  //dispatch the callback event
                                  ev.currentTarget.dispatchEvent(t$.Events.callback);
                              }else{
                                  console.log('Invalid SWIPE', _event.detail.dir, ev.currentTarget.tagName);
                                  //no dispatching
                              }
                              //RESET VALUES
                              swipe.endX= swipe.startX= swipe.endY= swipe.startY= 0;
                          }
                      }, {capture: true, passive: true});
                      t.addEventListener('touchcancel', function tcancel(ev){
                          //ev.stopPropagation();
                          console.log('touchcancel on', ev.currentTarget); 
                          //TODO - complete the touchcancel listener
                          //performance.mark('end');
                          //performance.measure('touching','start','end');
                          //performance.clearMeasures('touching');
                          performance.clearMarks('start');
                          //performance.clearMarks('end')
                      }, {capture: true, passive: true});
                  }
              }  
            }),
            SwipeMgr: (_targets) => {
                //set up swipe manager instance
                let targets;
                if(_targets.length){
                   targets = Array.from(_targets);
                }else{
                    targets = [_targets];
                }
                //console.log('num targets is', targets.length);
                return Object.assign({dir:undefined, 
                                      targets:targets,
                                      startX:0,
                                      startY:0,
                                      endX:0,
                                      endY:0,
                                      duration:0
                                     }, 
                                     t$.addSwipes(targets),
                                     t$.removeSwipes(targets) );
            }
        }