# warmjar

## Frontend

Authentication
* On load
  - get user from cookie
  - set user state variable
* On login
  - get user from response
  - set user state variable
* On logout
  - unset user state variable


## REST API

Retrive/create/update/delete site
* GET/POST sites/
* GET/PATCH/DELETE sites/site-id/
  - provides related pages and visits (GET)

Retrieve/update/delete page related to site
* GET pages/
  - server creates pages automatically
* GET/PATCH/DELETE pages/page-id/
  - provides related visits (GET)

Create visit with actions
* POST visits/

Add actions to or delete visit related to page
* PATCH/DELETE visits/visit-id/

Retrieve list of actions related to visit
* GET/POST visits/visit-id/actions/


## TODO

WIP
* record and render DOM
  - save style tags
  - save third-party stylesheet link tags
  - fetch and save same-origin stylesheets
  - render in iframe to avoid adding stylesheets to main site

Record
* handle different sized windows
  - send size on first api call
  - detect and send resize events
* keep same visit after refresh
  * local/session storage?
* transcompile with babel

Play
* sites, pages and visits pagination
* option to autoplay next visit
* grab visit data when visit is selected?
  - use visit detail view instead of actionlist

General
* e2e tests with cypress
* ci
  - travis / jenkins
  - auto deploy master


## Roadmap

### V0.1.1

Record
* Mouse
  - Movement
  - Clicks
  - Scroll
* Send data every, eg. 10 sec
* Don't record DOM

Play
* List of sites, pages and visits
* Selecting visit
  - Shows player
  - Allows play, pause and stop of action list
* Fetch more actions automatically
* Play successive visits automatically


### V0.1.2

Record
* Record DOM and mutations

Play
* Render DOM and mutations


### LATER

Record
* api key
  - limit action creation to authorized users
  - associate with user
* make compatible with IE
  - use Babel
* minify
* use a MutationObserver to wait for changes to stop when loading page

Play
* get API structure when checking out auth?
* improve auth system
  - firebase?
* scrollbar
* option to maximize player
* option to draw pointer path
* grab only necessary values from db with values() method
* paginate actions by 'performed' time?
* improve player width responsiveness
* use player content limiting dimension to handle portrait frames
* confirm delete
* allow admin to access all data
* make browser prompt to save login details

General
* REST subscription? Long pooling? etc.
* use GraphQL instead of REST
* handle zoom (record and play)
* is auth check needed if filtering with queryset?
* reply with new and/or current action count on visit post_list and patch
* more tests
* improve authentication system security
  - sanitize login data
* handle dynamic pages
  - user sets device sizes
  - user sets inaccessible cross-origin content (eg. stylesheets) so recorder can capture them
  - OR user grants warmjar domain access to inaccessible cross-origin content
  - auto save initial state for each device size
  - for each session save only mutations
  - keep page versions


## Bugs

ValueError: invalid literal for int() with base 10: '2020-08-13 16:39:57.210238'    


## Code

```js
function serializeDOMElement(element, nested = false) {
  var style = getComputedStyle(element);
  var obj = {
    tag: element.tagName,
    attributes: [...element.attributes].map(attr => [attr.name, attr.value]),
    style: [...style].map(prop => [prop, style.getPropertyValue(prop)]),
    children: [...element.children].map(child =>
      serializeDOMElement(child, true)
    ),
  };
  return nested ? obj : { obj, json: JSON.stringify(obj) };
}
// var dom = serializeDOMElement(document.documentElement); console.log(dom.obj, dom.json.length);


function getCSS() {
  return [...document.styleSheets].filter(isSameDomain).reduce(
    (css, sheet) => {
      css
    }
      // finalArr.concat(
      //   [...sheet.cssRules].filter(isStyleRule).reduce((propValArr, rule) => {
      //     const props = [...rule.style].map(propName => [
      //       propName.trim(),
      //       rule.style.getPropertyValue(propName).trim(),
      //     ]);
      //     return [...propValArr, ...props];
      //   }, [])
      // ),
    {}
  );
}
function isSameDomain(href) {
  return sheet.href && sheet.href.indexOf(window.location.origin) === 0;
}
function isStyleRule(rule) {
  return rule.type === 1;
}
var css = getCSSCustomPropIndex();
css;


Array.from(document.styleSheets).reduce(getSameOriginSheets, []);

function getSameOriginSheets(urls, sheet) {
  if (sheet.href && sheet.href.indexOf(window.location.origin) === 0) {
    urls.push(sheet.href);
  }
  return urls;
};


Array.from(document.styleSheets).map(getHref).filter(isSameOrigin);

function getHref(sheet) {
  return sheet.href;
}
function isSameOrigin(href) {
  return href && href.indexOf(window.location.origin) === 0
}
```
