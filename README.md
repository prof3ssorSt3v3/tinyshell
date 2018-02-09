# tiny$hell
## HTML5 CSS and JS framework for Mobile Hybrid Apps

**Last Update: Friday Feb 9, 2018**
### version: 0.0.2

This Framework is designed to work primarily with Cordova Hybrid Apps. The CSS and JavaScript are optimized to work with Chrome, as this is the engine used by Cordova.

The **/dist** folder contains all the files you need. Just take a copy of that folder to use in your projects. You will need the JavaScript file called tinyshell.min.js, the CSS file called tinyshell.min.css, plus the fonts folder which contains the icons. 

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

**3. clear( )** 

To remove all the listeners and all the targets from the manager.

```javascript
mgr.clear();
```

**4. removeTarget( element )** 

To remove a target from the array of targets, as well as it's listeners

```javascript
let element = document.querySelector('.cards:nth-child(1)');
mgr.removeTarget(element);
//this will remove the element from the targets array inside the manager as well as
//any listeners attached to that element
```

**5. addTarget( element )** 

To add a new target to the array of targets, and the listeners

```javascript
let element1 = document.querySelector('#somediv');
mgr.addTarget(element1);
//this will add the element to the target array and give it the same callback(s)
//as other elements in the targets array
```
**5. addTargets( elements )** 

To add an array (NodeList) of new targets to the array of targets. The method
will also add any existing listeners to the target. [COMING SOON]



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

## Pages

To create pages, simply add a **div** or **section** to the **body** and give it the class "page".

```html
<div class="page"></div>
```

By default all pages are hidden from the user. If you want to make a page visible then add the CSS class "active" to the "page" **div**, either in your HTML or through JavaScript.

```html
<div class="page active"></div>
```

## Navbars 

Navbars are areas that can be placed at the top or bottom of the screen. They are both fixed to allow content to scroll past underneath them. 

Add a block element like **nav** or **header** to your **body**, **OUTSIDE** of any "page". Give it the class "bar" plus either the class "top" or "bottom".

```html
<header class="bar top"></header>

<nav class="bar bottom"></nav>
```

Inside the bar element you can add a heading as an h1, h2, or h3 element.

Alternatively you can make the bar into a navigation bar by adding divs with the class "tab".

```html
<nav class="bar bottom">
    <div class="tab">Home</div>
    <div class="tab">Activities</div>
    <div class="tab">Contacts</div>
</nav>
```

Icons can be added to the tabs by adding both the class "icon" and the class for the individual icon that you want to use.

## Lists

Lists are designed to hold content inside their list items. The **ul** or **ol** element should be given a class "list-view" and then the list items will each be given a class "list-item".

The text inside the list item should be wrapped in a paragraph tag. 

If you want to add buttons to the left or right side of a list item you can add them as spans with the class "action-right" or "action-left". If you want to put an image on the left side instead of an action button you can add an image and give it the class "avatar".

```html
<ul class="list-view">
    <li class="list-item">
        <img src="//www.example.com/img/pic.jpg" alt="happy" class="avatar"/>
        <span class="action-right icon edit"></span>
        <p>Some text to show.</p>
    </li>
</ul>
```

The **PARAGRAPH** should be the **last** thing inside each list-item.

The action-right or action-left buttons should get the class "icon" plus the class that represents the icon you want to use for the list item.

## Cards

Cards are meant to be containers for content. They can have a header, a footer, and a content area.

Add a div with the class "card" to your page. If you want you can add a **header** or **footer** element inside the card. Place h1, h2, or h3 elements inside the header. Place paragraphs inside the footer. 

Everything between the header and footer is considered to be content for the card. Images will automatically be responsive and fill most of the width of the card.

If you want a card or a card's image to have rounded corners then you can add the class "round" to either.

```html
<div class="card">
    <header>
        <h2>Some Title</h2>
    </header>
    <img src="//www.example.com/img/happy.jpg" alt="Emoji" class="round" />
    <p>Some text to show up underneath the image inside the card.</p>
</div>
```
By default, cards will stack vertically in the page. If you want them to stack in the same position then add the class "fixed" to the card. Then they will all stack in the same position on the screen. The last card will be on top.

If you want a card to start off the screen, or not seen, then you have four options. Add the class "fixed" along with "top", "left", "right", or "dot".  Top, left, and right will position the card off the screen to the top, left, or right side respectively. The "dot" class shrinks the card down to 0% of it's original size.
```html
<div class="card fixed top">
    <header>
        <h2>Currently hidden off the top of the page</h2>
    </header>
    <img src="//www.example.com/img/happy.jpg" alt="Emoji" class="round" />
    <p>Some text to show up underneath the image inside the card.</p>
</div>
```
When you want the card to appear on the page in it's proper position, remove the class "top", "left", "right", or "dot" and replace it with the class "active".
```html
<div class="card fixed active">
    <header>
        <h2>Now Appearing</h2>
    </header>
    <img src="//www.example.com/img/happy.jpg" alt="Emoji" class="round" />
    <p>Some text to show up underneath the image inside the card.</p>
</div>
```

## Icons

The icons that are included in this framework are a subset of the ones that are available through Material Icons. Some of the icon names have been changed in the migration.

[https://material.io/icons/](https://material.io/icons/)

Here is the list of the names that are currently available in tinyshell.

* home
* fav
* heart
* headphones
* edit
* add
* delete
* remove
* clear
* attach
* emoji
* lock
* lock-open
* download
* upload
* refresh
* share
* camera
* check-circle
* star
* help
* info
* external
* user
* marker
* comments
* settings
* clock
* store
* thumb-up
* thumb-down
* calendar
* bookmark
* alert
* record
* play
* pause
* stop
* volume-on
* volume-off
* email
