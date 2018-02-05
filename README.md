# tiny$hell
HTML5 CSS and JS framework for Mobile Hybrid Apps

This Framework is designed to work primarily with Cordova Hybrid Apps. The CSS and JavaScript are optimized to work with Chrome, as this is the engine used by Cordova.

To use the TinyShell Script you need to first create an instance of the TinyShell object by calling the constructor method and passing in one or more HTML Elements as targets. Next you can call the addEventListener method once, on the TinyShell instance, for each desired event - swipeleft, swiperight, or tap.

# JAVASCRIPT

## Methods
**1. Constructor** 

Call this to create a TinyShell manager object

```javascript
let targets = document.querySelector('.cards');
let mgr = new t$(targets);
```

**2. addEventListener(eventName, callback)**

Call this to add a listener for one of the events to all targets

```javascript
mgr.addEventListener(t$.EventTypes.SWIPELEFT, doSomething);

function doSomething(ev){
    //ev.currentTarget will be the HTML element that triggered this
    //put your code here to do something with or to the HTML element
}
```

**3. clear** 

To remove all the listeners and all the targets from the manager.

```javascript
mgr.clear();
```

**4. removeTarget** 

To remove a target from the array of targets, as well as it's listeners

```javascript
let element = document.querySelector('.cards:nth-child(1)');
mgr.removeTarget(element);
//this will remove the element from the targets array inside the manager as well as
//any listeners attached to that element
```

**5. addTarget** 

To add a new target to the array of targets, and the listeners

```javascript
let element1 = document.querySelector('#somediv');
mgr.addTarget(element1, t$.EventTypes.SWIPERIGHT);
//this will add the element to the target array and give it the same swiperight callback
//as other elements in the targets array

let element2 = document.querySelector('#anotherdiv');
mgr.addTarget(element2, [t$.EventTypes.SWIPERIGHT, t$.EventTypes.SWIPELEFT, t$.EventTypes.TAP]);
//this will add element2 to the targets array and give it the same callbacks for swiperight, swipeleft, and tap as other elements in the targets array.
```


## Properties
The three event types that TinyShell listens for are held in an EventTypes object. You can use these constants in the addEventListener, removeEventListener, or addTarget methods

```javascript
t$.EventTypes.SWIPELEFT
t$.EventTypes.SWIPERIGHT
t$.EventTypes.TAP
```
## Error Messages

If you see the message "Sorry. Your browser does not support TinyShell." it means that you are using a device that does not have touch support.

If you are testing on a laptop or desktop browser, try toggling the Device Toolbar (Mobile emulation) in the Browser Development tools.

# STYLES

