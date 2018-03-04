# tiny$hell
## CSS and JS framework for Cordova Apps

**Last Update: Saturday Mar 3, 2018**
### version: 0.0.9

This Framework is designed to work primarily with Cordova Hybrid Apps. The CSS and JavaScript are optimized to work with Chrome, as this is the engine used by Cordova.

The **/dist** folder contains all the files you need. Just take a copy of that folder to use in your projects. You will need the JavaScript file called tinyshell.min.js, the CSS file called tinyshell.min.css, plus the fonts folder which contains the icons. 

To use the TinyShell Script you need to first create an instance of the TinyShell object by calling the constructor method and passing in one or more HTML Elements as targets. Next you can call the addEventListener method once, on the TinyShell instance, for each desired event - swipeleft, swiperight, or tap.

# JAVASCRIPT

## Methods
**1. Constructor** 

Call this to create a TinyShell manager object instance by passing it a single HTML element or a list of HTML elements.

```javascript
let target = document.querySelector('div');
let tiny = new t$(target);
//creates a new instance of tinyshell and adds a single div
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
## Content Areas

Page elements have no padding or margin attached to them by default. Cards and list-views have padding and margin. If you want to put content on the page and create the standard padding around the content then you need to add a section element with the className 'content'.

By default this will create padding at the top to allow for a top nav bar. If you are not using a top nav bar then add both the class "content" as well as the class "nobar".
```html
<section class="content">
    <h3>This heading will get standard padding</h3>
    <p>This paragraph will get standard padding</p>
</section>
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
```html
<nav class="bar bottom">
   <div class="tab current icon home">Home</div> 
   <div class="tab icon star">Fav</div> 
   <div class="tab icon user">User</div> 
</nav>
```
Additionally, if you want to style the tab that matches the current page then add the class "current" to the tab you want highlighted. Remember that you can override this class to change the appearance of the highlighting.

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

## Colours

There are eigth utility classes for colours. These are meant to be used for message to users. One set of four just changes the text colour. The other four change the background colour, the text colour, and set a border on the top and bottom.

The four text-only classes are "success", "error", "warn" and "info".

The four classes that change background, border, and text colour are "success-back", "error-back", "warn-back", and "info-back".

```html
<p class="success">This text will be green.</p>

<p class="info-back">This text will be white, on a blue background, with dark blue borders on the top and bottom.</p>
```

## Buttons
There are two general types of buttons that can be added with the classes "btn" or "btn-small". You can create buttons with spans, anchors, buttons, or input elements.

```html
<span class="btn">Click me</span>
<span class="btn-small">Click</span>
```

There are default sizes for the text, padding and line-height for the two buttons. If you want to style the buttons in a manner related to either Android or iOS then simply add the class "ios" or "android" to the body element on the page.

```html
<body class="ios">
    <span class="btn">Click me</span>
    <span class="btn-small">Click</span>
</body>
```

You can also add the colour classes to the buttons to change their colours.
```html
<section class="ios">
    <span class="btn info">Click me</span>
    <span class="btn-small success">Click me</span>
</section>
<section class="android">
    <span class="btn warn">Click</span>
    <span class="btn-small error">Click</span>
</section>
```


## Forms

Some basic styling for form elements have been added too. To implement the styles you would wrap each input - label pair of tags inside a block element (like a div or paragraph) and give the class "form-row" to the block element. Next you should give the attribute "required" to the form elements. These two things will trigger the tiny$hell styles for the form elements. 

```html
<form>
    <p class="form-row">
        <input type="text" id="nm" required/>
        <label for="nm">Name</label>
    </p>
    <p class="form-row buttons">
        <input type="button" id="btn-cancel" class="btn-small" value="cancel"/>
        <input type="submit" id="btn-sub" class="btn-small" value="submit"/>
    </p>
</form>
```

It is important that the label be placed after the input for the transitions to work properly.

For a row containing buttons, if you want them to be aligned to the right side, use the additional class "buttons".

## Typography

There are a series of utility classes for font sizes. You can add these to any elements to override the default font sizes.
The classes are "t1", "t2", "t3", "t4", and "t5". They range in size from 4.0rem to 0.75rem. They all use 1.5 as the line-height.

```html
<p class="t4">This is size four text</p>
```
```css
.t4{
    font-size: 1.0rem;
}
```
There is also a version of each class that changes the line-height to 1.0, for times when you need to conserve space. These classes all have "-1" added to the end of the name. Eg:
```html
<p class="t3-1">This has size 3 text with 1.0 line-height.</p>
```

There is also a version of each class that changes the line-height to 2.0, for times when you want to create more space.  These classes all have "-2" added to the end of the name. Eg: 
```html
<h1 class="t1-2">This has size 1 text with 2.0 as the line-height.</h1>
```

## Overlays

There is an overlay class that will create a layer overtop of your screen. This will allow you to display message to the user or force them to interact with a form before returning to the app. 

There are two versions of the overlay. One that covers just the working area of the screen and another that covers the page content as well as any "bar"s that you have at the top or bottom.

By default, any paragraphs that you include inside the overlay will be centered with padding around the edges. If you want, you can create overlays in your HTML and then control their appearance by changing the value of their display property between 'block' and 'none'.

```html
<div class="overlay">
    <p>This overlay will cover the content area.</p>
</div>
<div class="overlay-bars">
    <p>This overlay will cover the content area PLUS the bars at the top and bottom of the content area.</p>
</div>
```

Once you have created an overlay you can add other HTML on top of the overlay to display to users. Add the class "message" to a section to make it appear on top of the overlay. Then you can use your own CSS or the Tiny$hell utility classes for colours and typography to output your message.

```html
<section class="message">
    <h1 class="info t1">Important Wow</h1>
</section>
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
* quote


