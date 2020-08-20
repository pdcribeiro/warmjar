# warmjar

## TODO

WIP
* fix delete visit 403
* redo permissions
* tests

Record
* create pages automatically
* handle different sized windows
  - send size on first api call
  - detect and send resize events
* keep same visit after refresh

Play

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

General
* use GraphQL instead of REST


## Bugs

ValueError: invalid literal for int() with base 10: '2020-08-13 16:39:57.210238'    
