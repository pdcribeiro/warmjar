# warmjar

## Possible actions

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
* tests

Record
* handle different sized windows
  - send size on first api call
  - detect and send resize events
* keep same visit after refresh
  * local/session storage?

Play
* update list after delete

General
* tests
  - django
  - react
  - selenium
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
* No auth system
* List of sites, pages and visits
* Selecting visit
  - Shows player
  - Allows play, pause and stop of action list
* Fetch actions gradually
* Play successive visits


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

Play
* Get API structure when checking out auth?
* Improve auth system
  - Firebase?
* scrollbar
* option to maximize player
* option to draw pointer path
* grab only necessary values from db with values() method
* paginate actions by 'performed' time?
* improve player width responsiveness
* use player content limiting dimension to handle portrait frames
* confirm delete
* allow admin to access all data

General
* REST subscription? Long pooling? etc.
* use GraphQL instead of REST
* handle zoom (record and play)
* Is auth check needed if filtering with queryset?


## Bugs

ValueError: invalid literal for int() with base 10: '2020-08-13 16:39:57.210238'    
