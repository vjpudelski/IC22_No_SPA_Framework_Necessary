# Lab Instructions

This document will walk through the steps to create and execute the lab performed with the conference session.

## Setup

1. Create a Folder for your project and include an index.html file and folders for scripts, components and pages

2. Open the index.html file and insert the following starter code:

```html
  <!DOCTYPE html>
  <html>
    <head>
      <title>No SPA Framework Necessary</title>
    </head>
    <body>
      <h1>Hello World!</h1>
      <div id="content"></div>
    </body>
  </html>
</code>
```

## Routing

3. Create a routes.js file in the */scripts/* directory

This file will contain an array of objects containing the information about our routes. Each route will have a path, an object and one of those routes will be designated by a default flag. One such object would be:

```javascript
export let routes = [
  {
    path: "/",
    component: null,
    default: true
  }
];
```

4. Create a *router.js* file in the */scripts/* directory

This will be a class file that contains our routing code. Below is the template we will build it from.

```javascript
export default class Router {
  constructor(routes, rootElement) { }
}
```

We are creating a class for our Router and inside that class including a constructor. The constructor will take in 2 properties:
- **routes** - an array of route objects
- **rootElem** - the element inside our index.html (or another html file) that the page should load into

5. inside our *constructor* method let's initialize some variables with parameters passed in

```javascript
  constructor(routes, rootElement) {
    this.routes = routes;
    this.rootElement = document.querySelector(rootElement);
  }
```

for the *defaultRoute*, there is a little more work since we don't know which route is the default

```javascript
    for (let i = 0, length = routes.length; i < length; i++) {
      let route = routes[i];
      if (route.default) {
        this.defaultRoute = route;
      }
    }
```

6. Next call a method to send us to the current route. Don't forget to define the method

The call is inside the constructor

```javascript
    this.goToRoute(window.location.hash);
```

The method goes inside the class but outside our constructor method.

```javascript
  goToRoute(path) {
    
  }
```

7. Inside the *gotoRoute* method let's add the logic

Start with returning the route requested. This will be another method we will get to in the next step.
Next set the *rootElement* to the component in the route object

```javascript
  goToRoute(path) {
    let nav = this.getRouteFromPath(path);

    this.rootElement.innerHTML = nav.route.component.render(nav.params);
    nav.route.component.init();
  }
```

8. Inside a new method *getRouteFromPath* implement logic to parse the path and 
find the route object that matches

start with some variable intializations

```javascript
  getRouteFromPath(path) {
    let route = undefined;

    let paramsNames = [];
    let params = {};
  }
```

next we need a loop to go through the routes

```javascript
    for (let i = 0, length = this.routes.length; i < length; i++) {
      paramsNames = [];

    }
```

inside our loop we need to parse out the paramters. To do that we will use a regular expression to get each value 
starting with a ':' and know this could be any value in the actual path. 

SEE SLIDES

```javascript
      let regexPath =
        this.routes[i].path.replace(/([:*])(\w+)/g, (full, colon, path) => {
          paramsNames.push(path);
          return "([^/]+)";
        }) + "(?:/|$)";
```

next execute to see if the path matches the current route and if we have a match set the parameter values and set the route variable

```javascript
      let matchPath = path.match(new RegExp(regexPath));

      if (matchPath !== null) {
        params = matchPath.splice(1).reduce((params, value, index) => {
          if (params === null) params = {};

          params[paramsNames[index]] = value;
          return params;
        }, null);

        route = this.routes[i];
        break;
      }
```

if the route isn't found, make sure you return the default route and then return the route and parameters

```javascript
    route = route ? route : this.defaultRoute;
    return { route, params };
```

8. return to the constructor and add an event handler for when the hash value changes to call *gotoRoute*

```javascript
    window.addEventListener("hashchange", (e) => {
      this.goToRoute(e.currentTarget.location.hash);
    });
```

9. Implement your Router by creating an app.js script in the */script/* director and adding the following code

```javascript
import router from './router.js';
import { routes } from './routes.js';

let myrouter = new router(routes, "#content");
```

10. Add our *app.js* script to the *index.html*

```html
  <body>
    <h1>Hello World!</h1>
    <div id="content"></div>
    <script type="module" src="scripts/app.js"></script>
  </body>
```

## Create a Page (View)

11. Create our home page as *home.js* in the */pages/* directory

```javascript
export default class HomePage {
  constructor() { }

  init() { }

  render(params) { }
}
```

this is a good template for every page here after

12. Add some html to our home page

To do this, I like to create methods for the initial html

Add the following to the top of the *home.js* file outside of the class

```javascript
const html = () => /*html*/`
<div>
  <p>This is my Home Page</p>
</div>
`;
```

and call it in the render function

```javascript
  render(params) {
    return html();
  }
```

13. Add our component back to the *routes.js* file for the default route

```javascript
import HomePage from '../pages/home.js';

export let routes = [
  {
    path: "/",
    component: new HomePage(),
    default: true
  }
];
```

TRY OUT THE SITE AND SEE IF HOME DISPLAYS!!!

Notice every path returns to the same page...

## Create A New Route

14. Create a new page as *new.js* in the */pages/* directory

```javascript
export default class NewPage {
  constructor() { }

  init() { }

  render(params) { }
}
```

15. Add the html to our new page

Method at the top of the class file

```javascript
const html = () => /*html*/`
<div>
  <p>This is my New Page</p>
</div>
`;
```

and call it in the render function

```javascript
  render(params) {
    return html();
  }
```

16. Add our Route to *routes.js*

```javascript
  {
    path: "/new",
    component: new NewPage()
  }
```

don't forget your comma after the first route, assuming this is now your second route

```javascript
import HomePage from '../pages/home.js';
import NewPage from '../pages/new.js';

export let routes = [
  {
    path: "/",
    component: new HomePage(),
    default: true
  }, // <-- this comma here
  {
    path: "/new",
    component: new NewPage()
  }
];
```

You can also see at the top of the file I have a reference to NewPage. This was added by vscode when I typed `new NewPage()` if that doesn't happen for you, you may have to manually add it to the top.

Now browse to your new path... 

IT SHOULD WORK!!!

That's all there is to adding a new view or page!

## Creating a Component

17. Create a new component as *simpleText.js* in the */components/* directory

```javascript
const html_simpleText = () => /*html*/`
<div>
  <label for="text-input"></label>
  <input id="text-input" />
</div>
`;

class SimpleText extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.innerHTML = html_simpleText();
  }
}
customElements.define('simple-text', SimpleText);
```

18. Add the component to the *index.html* page

this can go below the *app.js* script reference

```javascript
    <script type="module" src="components/simpleText.js"></script>
```

19. Add the component to the *new.js* view

```javascript
const html = () => /*html*/`
<div>
  <p>This is my New Page</p>
  <simple-text></simple-text>
</div>
`;
```

RUN THE PAGE AND SEE YOUR COMPONENT GET ADDED

20. Let's add a *text* attribute to the simple-text element inside *simpleText.js*

All of these methods can go at the bottom of the class. Be sure to keep the code
within the class, though. It is part of the extension of HTMLElement.

```javascript
  attributeChangedCallback (name, oldValue, newValue) {
    this.render();
  }

  static get observedAttributes() {
    return ['text'];
  }
  
  get text() {
    return this.getAttribute('text');
  }

  set text(value) {
    this.setAttribute('text', value);
  }

  render() {
    if (this.text) {
      this.shadowRoot.querySelector('label').innerHTML = this.text;
    }
  }
```

21. Set the text attribute on the element in the *new.js*

```javascript
  <simple-text text="Name"></simple-text>
```

## Adding a scoped Style

22. Add the following `<style>` tag to the *simpleText.js* file inside the *h*tml_simpleText* method

```javascript
<style>
  label {
    display: block;
  }
</style>
```

23. To demonstrate the style being scoped to the control copy the `<div>` from *simpleText.js* to *new.js* inside the *html* method

```html
  <simple-text text="Name"></simple-text>
  <div>
    <label for="text-input">Another Label</label>
    <input id="text-input" />
  </div>
`;
```

The `<label>` from the one we just copied is *inline* inside of *block* display when directly on the *new.js* page
