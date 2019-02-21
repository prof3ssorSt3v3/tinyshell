# tiny\$hell

## CSS and JS framework for Cordova Apps

**Last Update: Thursday Feb 21, 2019**

### version: 1.0.0

This Framework is designed to work primarily with Cordova Hybrid Apps. The CSS and JavaScript are optimized to work with Chrome, as this is the engine used by Cordova.

The **/dist** folder contains all the files you need. Just take a copy of that folder to use in your projects. You will need the JavaScript file called tinyshell-min.js, the CSS file called tinyshell.css, plus the fonts folder which contains the icons.

To use the TinyShell Script you need to first create an instance of the TinyShell object by calling the constructor method and passing in one or more HTML Elements as targets. Next you can call the addEventListener method once, on the TinyShell instance, for each desired event - swipeleft, swiperight, or tap.

# JAVASCRIPT

## Methods

**1. Constructor**

Call this to create a TinyShell manager object instance by passing it a single HTML element or a list of HTML elements.

```javascript
let target = document.querySelector("div");
let tiny = new tinyshell(target);
//creates a new instance of tinyshell and adds the selected element
```

You will need the variable `tiny` later on to add the Event Listeners to the element.

**2. addEventListener(eventName, callback)**

Call this to add a listener for one of the possible events to the element contained inside the tinyshell object.

```javascript
tiny.addEventListener("swipeleft", doSomething);

function doSomething(ev) {
  //ev.currentTarget will be the HTML element that triggered this
  //put your code here to do something with or to the HTML element
}
```

The possible events that you can use are `tap`, `swipeleft`, `swiperight`, `revealleft`, and `revealright`. You can add all five events to the same object if you want.

The `revealleft` and `revealright` events are specifically for use with list-item elements when they have elements off the side of the screen that you want to reveal and let the user tap. A typical use case for this would be to slide a list item to the right to reveal a delete button.

Your callback functions can do anything you want... like animating an element off the screen. Use CSS to initiate the transition as defined in your own CSS. Then add a `setTimeout` which will remove the element from the page once it has finished its transition.

Here is an example of swiping an element off the page and removing it.

```css
.item {
  background-color: #eee;
  transition: transform 0.4s linear;
}

.goleft {
  transform: translateX(-200%);
}
```

```html
<div class="item">
  Swipe this div to the left and watch it disappear.
</div>
```

```js
function init() {
  let div = document.querySelector(".item");
  let tiny = new tinyshell(div);
  tiny.addEventListener("swipeleft", goAway);
}

function goAway(ev) {
  let div = ev.currentTarget;
  div.classList.add("goleft");
  setTimeout(
    function() {
      //remove the div from its parent element after 0.5s
      this.parentElement.removeChild(this);
    }.bind(div),
    500
  );
}
```

**4. removeEventListener(eventName, callback)**

To remove a target from the array of targets, as well as it's listeners

```javascript
let element = document.querySelector(".cards:nth-child(1)");
let tiny = new tinyshell(element);
tiny.addEventListener("swiperight", someFunc);
//...later you want to get rid of the swipe right listener
tiny.removeEventListener("swiperight", someFunc);
//this will remove the swiperight listener attached to that element
```

## Properties

The five event types that TinyShell listens for are held in an EventTypes object. You can use these constants in the addEventListener or removeEventListener methods in place of the strings `swipeleft`, `swiperight`, `tap`, `revealleft`, or `revealright`.

```javascript
tinyshell.EventTypes.SWIPELEFT;
tinyshell.EventTypes.SWIPERIGHT;
tinyshell.EventTypes.TAP;
tinyshell.EventTypes.REVEALLEFT;
tinyshell.EventTypes.REVEALRIGHT;
```

## Error Messages

If you see the message "Sorry. Your browser does not support TinyShell." it means that you are using a device that does not have touch support.

If you are testing on a laptop or desktop browser, try toggling the Device Toolbar (Mobile emulation) in the Browser Development tools.

When testing in an iOS Simulator you will need to use XCode to see the console messages. When testing on an iOS device you can use the Safari development tools to see the messages. When testing on an Android Emulator or Android Device you can use the Chrome development tools to see the error messages.

# STYLES

Version 1.x of the Tiny\$hell framework styles use **flexbox** for alignment and layout instead of the floats that were used in version 0.x of the framework.

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

By default this will create padding at the top to allow for a top nav bar. If you are not using a top nav bar then add both the class `content` as well as the class `nobar`.

```html
<section class="content nobar">
  <p>Some content in the page that has no header bar at the top.</p>
</section>
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

If you want to create a narrower bar at the top which will just contain links then you can use the classes "bar-half" and "top".

```html
<nav class="bar-half top">
  <a href="#" class="link left icon cancel">Cancel</a>
  <a href="#" class="link right icon save">Save</a>
</nav>
```

You can use anchor tags with the class "link" instead of divs with the class "tab" for a more minimal view. These can have icons added too.

Icons can be added to the tabs by adding both the class "icon" and the class for the individual icon that you want to use.
BEST PRACTICE is to use both icons and text in your tabs.

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

If you want to add buttons to the left or right side of a list item, which will always be visible, you can add them as divs with the class `action-right` or `action-left`. If you want to put an image on the left side instead of an action button you can add an image inside the div and give it the class `avatar` or `avatar-box`.

### RevealLeft and RevealRight Elements

New in this version of Tiny\$hell are the `reveal-left` and `reveal-right` areas. These are divs that will be placed to the left or right of the `list-item` however they cannot be seen unless the user drags the `list-item` to the left or right. These elements are the purpose of the `revealleft` and `revealright` events.

When you add the `reveal-left` and/or `reveal-right` divs then you also need to add a class to the `list-item`. The choices are `has-reveal-left`, `has-reveal-right` and `has-reveal-both`. These three classes are required by the script that runs when you add the `revealleft` or `revealright` event listener to the `list-item`.

```html
<ul class="list-view">
  <li class="list-item has-reveal-left">
    <div class="reveal-left"><i class="icon delete"></i></div>
    <div class="list-text">Drag this one left.</div>
    <div class="action-right"><span class="icon edit"></span></div>
  </li>
  <li class="list-item has-reveal-both">
    <div class="reveal-left"><i class="icon delete"></i></div>
    <div class="list-text">Drag this one right.</div>
    <div class="reveal-right"><i class="icon delete"></i></div>
  </li>
  <li class="list-item">
    <div class="action-left">
      <img src="//www.example.com/img/pic.jpg" alt="happy" class="avatar" />
    </div>
    <div class="list-text">
      <p>Some text to show.</p>
      <p>Some more text.</p>
    </div>
    <div class="action-right">
      <i class="icon edit"></i>
    </div>
  </li>
</ul>
```

The action-right or action-left buttons could get the class `icon` plus the class that represents the icon you want to use for the list item OR you can put a `span` or `i` element inside the div with the class `icon` and the class name for the type of icon you want. See the notes on icons below.

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

If you want a card to start off the screen, or not seen, then you have four options. Add the class "fixed" along with "top", "left", "right", or "dot". Top, left, and right will position the card off the screen to the top, left, or right side respectively. The "dot" class shrinks the card down to 0% of it's original size.

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

<p class="info-back">
  This text will be white, on a blue background, with dark blue borders on the
  top and bottom.
</p>
```

## Buttons

There are two general types of buttons that can be added with the classes "btn" or "btn-small". You can create buttons with spans, anchors, buttons, or input elements.

```html
<span class="btn">Click me</span> <span class="btn-small">Click</span>
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

Some basic styling for form elements have been added too. To implement the styles you would wrap each input - label pair of tags inside a block element (like a div or paragraph) and give the class "form-row" to the block element. Next you should give the attribute "required" to the form elements. These two things will trigger the tiny\$hell styles for the form elements.

```html
<form>
  <p class="form-row">
    <input type="text" id="nm" required />
    <label for="nm">Name</label>
  </p>
  <p class="form-row buttons">
    <input type="button" id="btn-cancel" class="btn-small" value="cancel" />
    <input type="submit" id="btn-sub" class="btn-small" value="submit" />
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
.t4 {
  font-size: 1rem;
}
```

There is also a version of each class that changes the line-height to 1.0, for times when you need to conserve space. These classes all have "-1" added to the end of the name. Eg:

```html
<p class="t3-1">This has size 3 text with 1.0 line-height.</p>
```

There is also a version of each class that changes the line-height to 2.0, for times when you want to create more space. These classes all have "-2" added to the end of the name. Eg:

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
  <p>
    This overlay will cover the content area PLUS the bars at the top and bottom
    of the content area.
  </p>
</div>
```

Once you have created an overlay you can add other HTML on top of the overlay to display to users. Add the class "message" to a section to make it appear on top of the overlay. Then you can use your own CSS or the Tiny\$hell utility classes for colours and typography to output your message.

```html
<section class="message">
  <h1 class="info t1">Important Wow</h1>
</section>
```

## Utility Classes

There are classes "right" and "left" for floating content to the left or right.

There is a "fluid" class that you can add to images or other media elements to make them responsive.

```html
<p><img src="./img/sample.jpg" alt="Some Image" class="fluid" /></p>
```

## Icons

The icons that are included in this framework are a subset of the ones that are available through Material Icons. Some of the icon names have been changed in the migration.

[https://material.io/icons/](https://material.io/icons/)

Here is the list of the names that are currently available in tinyshell.

- home
- fav
- heart
- headphones
- edit
- add
- delete
- remove
- clear
- cancel
- save
- arrow_up
- arrow_down
- arrow_right
- arrow_left
- microphone
- attach
- emoji
- lock
- lock-open
- download
- upload
- refresh
- share
- camera
- check-circle
- star
- help
- info
- external
- user
- marker
- comments
- settings
- clock
- store
- thumb-up
- thumb-down
- calendar
- bookmark
- alert
- record
- play
- pause
- stop
- volume-on
- volume-off
- email
- quote
