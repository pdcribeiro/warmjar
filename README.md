# warmjar

## TODO

WIP
* build player
  - ...

Record
* api key
  - replace page_url field in Page model with domain field in Site model 
  - associate api key with user
  - create pages automatically
* handle different sized windows
  - send size on first api call
  - detect and send resize events
* keep same visit after refresh

Play
* ...


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
* make compatible with IE
  - use Babel
* minify

Play
* scrollbar
* grab only necessary values from db with values() method
* paginate actions by 'performed' time?
* center player content vertically
* improve player width responsiveness
* use player content limiting dimension

General
* use GraphQL instead of REST


## Bugs

ValueError: invalid literal for int() with base 10: '2020-08-13 16:39:57.210238'    
