"use strict";

/* @licence tinyshell.js
 * Copyright (c) 2017-2019 Steve Griffith
 * https://github.com/prof3ssorSt3v3/TinyShell/
 * Released under MIT license
 * Limited Use scenario - this is intended to be used in mobile devices
 * in combination with the Cordova Framework only
 * @version 1.0.0
 */

class tinyshell {
  constructor(elem) {
    this.element = elem;

    this.Params = {
      startX: 0,
      startY: 0,
      moved: false,
      duration: 0,
      maxSwipeTime: 400,
      minDistance: 25,
      maxDistance: 20,
      maxDrag: 0,
      minDrag: 10,
      listeners: new Set(),
      pageWidth: 0,
      twenty: 0
    };

    this.EventTypes = {
      SWIPELEFT: "swipeleft",
      SWIPERIGHT: "swiperight",
      REVEALLEFT: "revealleft",
      REVEALRIGHT: "revealright",
      TAP: "tap"
    };

    this.Events = {
      swipeleft: new CustomEvent("swipeleft", {
        detail: {
          dir: "left",
          callback: null
        }
      }),
      revealleft: new CustomEvent("revealleft", {
        detail: {
          dir: "left",
          callback: null
        }
      }),
      swiperight: new CustomEvent("swiperight", {
        detail: {
          dir: "right",
          callback: null
        }
      }),
      revealright: new CustomEvent("revealright", {
        detail: {
          dir: "right",
          callback: null
        }
      }),
      tap: new CustomEvent("tap", {
        detail: {
          callback: null
        }
      })
    };
  }

  addEventListener = function(ev, callback) {
    //check for support of performance.mark and performance.measure
    if (!window.performance.mark || !window.performance.measure) {
      window.tinymarks = new Map();
      window.tinymeasures = new Map();
      window.performance.prototype.mark = function(_name) {
        let t = performance.now();
        window.tinymarks.set(_name, t);
      };
      window.performance.prototype.measure = function(_name, _mark1, _mark2) {
        let m1 = window.tinymarks.get(_mark1);
        let m2 = window.tinymarks.get(_mark2);
        if (m1 && m2) {
          let diff = m2 - m1;
          window.tinymeasures.set(_name, diff);
          return diff;
        } else {
          window.tinymeasures.set(_name, 0);
          return 0;
        }
      };
      window.performance.prototype.clearMarks = function(_name) {
        window.tinymarks.delete(_name);
      };
      window.performance.prototype.getEntriesByName = function(
        _name,
        _type = "measure"
      ) {
        if (_type == "measure") {
          return window.tinymeasures.get(_name);
        } else {
          return window.tinymarks.get(_name);
        }
      };
    }

    //set the eventtype hold the name of the callback function
    this.Events[ev].detail.callback = callback;
    if (!this.Params.listeners.has(this.Events[ev])) {
      //only one of each type of event can be added to an element
      this.element.addEventListener(ev, callback);
    }
    this.Params.listeners.add(this.Events[ev]);
    this.Params.pageWidth = document.body.clientWidth;
    this.Params.twenty = document.body.clientWidth * 0.2;
    this.Params.maxDrag = this.Params.pageWidth * 0.8;
    this.Params.minDrag = this.Params.maxDrag * 0.2;

    if (this.Params.listeners.size === 1) {
      // adding the touchevents
      this.element.addEventListener("touchstart", this);
      this.element.addEventListener("touchend", this);
      this.element.addEventListener("touchmove", this);
      this.element.addEventListener("touchcancel", this);
    }
  };

  removeEventListener = function(ev, callback) {
    this.Params.listeners.delete(this.Events[ev]);
    //remove the touch listeners if ALL callbacks are null.
    if (this.Params.listeners.size === 0) {
      this.element.removeEventListener("touchstart", this);
      this.element.removeEventListener("touchend", this);
      this.element.removeEventListener("touchmove", this);
      this.element.removeEventListener("touchcancel", this);
    }
  };

  handleEvent = function(ev) {
    //console.log('handling', ev.type);
    switch (ev.type) {
      case "touchstart":
        this.start(ev);
        break;
      case "touchmove":
        this.move(ev);
        break;
      case "touchend":
        this.end(ev);
        break;
      case "touchcancel":
        this.cancel(ev);
        break;
    }
    ev.stopImmediatePropagation();
  };

  cancel = function(ev) {
    console.log("cancel", ev.type);
    //touch cancel handler
  };

  move = function(ev) {
    //console.log('touchmove', ev.type);
    //used for revealleft and revealright
    if (
      this.Events["revealleft"].detail.callback ||
      this.Events["revealright"].detail.callback
    ) {
      let touches = ev.changedTouches;
      if (touches.length == 1) {
        performance.mark("move");
        performance.measure("moving", "start", "move");
        let m = performance.getEntriesByName("moving", "measure");
        let duration = m[0].duration;
        let deltaX =
          Math.max(this.Params.startX, touches[0].pageX) -
          Math.min(this.Params.startX, touches[0].pageX);
        let deltaY =
          Math.max(touches[0].pageY, this.Params.startY) -
          Math.min(touches[0].pageY, this.Params.startY);
        let dir = "";
        if (
          Math.max(this.Params.startX, touches[0].pageX) == this.Params.startX
        ) {
          //start was to the right so this is a swipe left
          dir = "left";
        } else {
          dir = "right";
        }
        //console.log('dir', dir);
        if (
          (this.Events["revealleft"].detail.callback && dir === "left") ||
          (this.Events["revealright"].detail.callback && dir === "right")
        ) {
          //need to handle drag with or without reveal areas
          let move = 0;
          if (
            dir === "right" &&
            (this.element.classList.contains("has-reveal-left") ||
              this.element.classList.contains("has-reveal-both"))
          ) {
            move = Math.min(deltaX + -1 * this.Params.twenty, 0);
          } else {
            //nothing to reveal
            move = 0;
          }
          if (
            (dir === "left" &&
              this.element.classList.contains("has-reveal-right")) ||
            this.element.classList.contains("has-reveal-both")
          ) {
            if (
              this.element.classList.contains("has-reveal-left") ||
              this.element.classList.contains("has-reveal-both")
            ) {
              //starting at -20vw
              move =
                -1 * Math.min(this.Params.twenty, deltaX) - this.Params.twenty;
              //console.log(move, deltaX, this.Params.twenty)
            } else {
              //starting at zero
              move = -1 * Math.max(deltaX, this.Params.twenty);
            }
          }
          //console.log('move', move);
          this.element.style.transform = `translateX(${move}px)`;
        }
        performance.clearMarks("move");
      }
    }
  };

  start = function(ev) {
    console.log("start", ev.type);
    let touches = ev.changedTouches;
    this.Params.startX = touches[0].pageX;
    this.Params.startY = touches[0].pageY;
    performance.mark("start");
  };

  end = function(ev) {
    console.log("end", ev.type);
    let touches = ev.changedTouches;
    //Must be changedTouches as ev.touches.length would be zero
    if (touches.length == 1) {
      performance.mark("end");
      performance.measure("touching", "start", "end");
      let m = performance.getEntriesByName("touching", "measure");
      let duration = m[0].duration;
      let deltaX =
        Math.max(this.Params.startX, touches[0].pageX) -
        Math.min(this.Params.startX, touches[0].pageX);
      let deltaY =
        Math.max(touches[0].pageY, this.Params.startY) -
        Math.min(touches[0].pageY, this.Params.startY);
      let dir = "";
      if (
        Math.max(this.Params.startX, touches[0].pageX) == this.Params.startX
      ) {
        //start was to the right so this is a swipe left
        dir = "left";
      } else {
        dir = "right";
      }
      //for tap
      if (
        this.Events["tap"].detail.callback !== null &&
        typeof this.Events["tap"].detail.callback === "function"
      ) {
        if (
          deltaX < this.Params.maxDistance &&
          deltaY < this.Params.maxDistance
        ) {
          ev.currentTarget.dispatchEvent(this.Events["tap"]);
          //stop here and don't bother with the swipes
          //since the minDistance was not reached
          performance.clearMarks("start");
          performance.clearMarks("move");
          performance.clearMarks("end");
          return;
        }
      }
      //for swipeleft
      if (
        dir == "left" &&
        this.Events["swipeleft"].detail.callback !== null &&
        typeof this.Events["swipeleft"].detail.callback === "function"
      ) {
        if (
          deltaX > this.Params.minDistance &&
          duration < this.Params.maxSwipeTime &&
          deltaX > deltaY
        ) {
          //do callback to be handled by this.handleEvent
          ev.currentTarget.dispatchEvent(this.Events["swipeleft"]);
        } else {
          console.log("Invalid swipeleft", deltaX, duration); //invalid swipe
        }
        performance.clearMarks("start");
        performance.clearMarks("move");
        performance.clearMarks("end");
        return;
      }
      //for swiperight
      if (
        dir == "right" &&
        this.Events["swiperight"].detail.callback !== null &&
        typeof this.Events["swiperight"].detail.callback === "function"
      ) {
        if (
          deltaX > this.Params.minDistance &&
          duration < this.Params.maxSwipeTime &&
          deltaX > deltaY
        ) {
          //do callback to be handled by this.handleEvent
          ev.currentTarget.dispatchEvent(this.Events["swiperight"]);
        } else {
          console.log("Invalid swiperight", deltaX, duration); //invalid swipe
        }
        performance.clearMarks("start");
        performance.clearMarks("move");
        performance.clearMarks("end");
        return;
      }
      //for revealleft
      if (
        this.Events["revealleft"].detail.callback &&
        dir == "left" &&
        typeof this.Events["swiperight"].detail.callback === "function"
      ) {
        //handle the min / max drag distance
        if (Math.abs(deltaX) < this.Params.minDrag) {
          //console.log('dragged between min and max', this.Params.minDrag, this.Params.maxDrag);
          //back to original position
          if (
            this.element.classList.contains("has-reveal-left") ||
            this.element.classList.contains("has-reveal-both")
          ) {
            this.element.style.transform = `translateX(${-1 *
              this.Params.twenty}px)`;
          } else {
            this.element.style.transform = `translateX(${0}px)`;
          }
        } else if (Math.abs(deltaX) > this.Params.maxDrag) {
          //snap to reveal position
          if (
            this.element.classList.contains("has-reveal-left") ||
            this.element.classList.contains("has-reveal-both")
          ) {
            this.element.style.transform = `translateX(${this.Params.twenty *
              -2}px)`;
          } else {
            this.element.style.transform = `translateX(${this.Params.twenty *
              -1}px)`;
          }
        } else {
          //between min and max...
          if (
            this.element.classList.contains("has-reveal-left") ||
            this.element.classList.contains("has-reveal-both")
          ) {
            this.element.style.transform = `translateX(${-1 *
              this.Params.twenty}px)`;
          } else {
            this.element.style.transform = `translateX(${0}px)`;
          }
        }
        ev.currentTarget.dispatchEvent(this.Events["revealleft"]);
        performance.clearMarks("start");
        performance.clearMarks("move");
        performance.clearMarks("end");
      }
      //for revealright
      if (this.Events["revealright"].detail.callback && dir == "right") {
        //handle the min / max drag distance
        if (Math.abs(deltaX) <= this.Params.minDrag) {
          //back to starting position
          if (
            this.element.classList.contains("has-reveal-left") ||
            this.element.classList.contains("has-reveal-both")
          ) {
            this.element.style.transform = `translateX(${-1 *
              this.Params.twenty}px)`;
            //'back to start'
          } else {
            this.element.style.transform = `translateX(${0}px)`;
            //'no reveal left'
          }
        } else if (Math.abs(deltaX) > this.Params.maxDrag) {
          //snap to reveal position
          if (
            this.element.classList.contains("has-reveal-left") ||
            this.element.classList.contains("has-reveal-both")
          ) {
            this.element.style.transform = `translateX(${0}px)`;
          } else {
            this.element.style.transform = `translateX(${0}px)`;
          }
        } else {
          //between min and max
          if (
            this.element.classList.contains("has-reveal-left") ||
            this.element.classList.contains("has-reveal-both")
          ) {
            this.element.style.transform = `translateX(${-1 *
              this.Params.twenty}px)`;
          } else {
            this.element.style.transform = `translateX(${0}px)`;
          }
        }
        ev.currentTarget.dispatchEvent(this.Events["revealright"]);
        performance.clearMarks("start");
        performance.clearMarks("move");
        performance.clearMarks("end");
      }
      if (
        deltaX < this.Params.minDrag &&
        (this.Events["revealright"].detail.callback ||
          this.Events["revealleft"].detail.callback)
      ) {
        //snap back to original position
        if (
          this.element.classList.contains("has-reveal-left") ||
          this.element.classList.contains("has-reveal-both")
        ) {
          this.element.style.transform = `translateX(${-1 *
            this.Params.twenty}px)`;
          //'back to start'
        } else {
          this.element.style.transform = `translateX(${0}px)`;
          //'no reveal left'
        }
      }
    }
  };
}
