const ACTIONS_LENGTH_TRIGGER = 50;
const BASE_URL = 'http://warmjar.ddns.net/api/visits/';
const MEDIA_TYPE = 'text/plain';

var visitID = null;
var actions = [];
var loaded = new Date();

function init() {
  startRecording();
  var previousVisitID = sessionStorage.getItem('warmjar.visitID') || null;
  fetchVisitID(previousVisitID)
    .then(id => {
      // console.log('visitID:', id);
      visitID = id;
      sessionStorage.setItem('warmjar.visitID', id);
    })
    .catch(error => console.error('Failed to fetch visitID.', error));
}
init();

function startRecording() {
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mousedown', handleMouseDown);
  window.addEventListener('mouseup', handleMouseUp);
  window.addEventListener('unload', handleUnload);
}

function fetchVisitID(previousVisitID) {
  var data = { url: window.location.href, previous: previousVisitID };
  // console.log('fetching visit id...', data);
  return postJSON(BASE_URL, data).then(response => response.visit);
}

function postJSON(url, data) {
  var req = new XMLHttpRequest();
  req.open('POST', url);
  req.setRequestHeader('Content-Type', MEDIA_TYPE);

  var promise = new Promise(function (resolve, reject) {
    req.onload = function () {
      if (200 <= req.status <= 299) {
        resolve(JSON.parse(req.responseText));
      }
      reject('Request failed (' + req.status + ').');
    };
    req.onerror = function () {
      reject('Request failed (' + req.status + ').');
    };
    setTimeout(function () {
      reject('Request timed out.');
    }, 5000);
  });

  req.send(JSON.stringify(data));

  return promise;
}

function handleMouseMove(event) {
  createMouseAction('mm', event);
}
function handleMouseDown(event) {
  createMouseAction('md', event);
}
function handleMouseUp(event) {
  createMouseAction('mu', event);
}
function createMouseAction(type, event) {
  createAction(type, {
    x: event.clientX,
    y: event.clientY,
  });
}

function createAction(type, values) {
  actions.push({ type, ...values, performed: new Date() - loaded });
  if (actions.length === ACTIONS_LENGTH_TRIGGER && visitID) {
    sendActions(actions.splice(0, ACTIONS_LENGTH_TRIGGER));
  }
}

function sendActions(actions) {
  // console.log('sending actions...', actions.slice(0, 5));
  postJSON(getURL(), { actions }).catch(error =>
    console.error('Failed to send actions.', error)
  );
}

function getURL() {
  return BASE_URL + visitID + '/';
}

function handleUnload() {
  if (visitID) {
    var blob = new Blob([JSON.stringify({ actions })], { type: MEDIA_TYPE });
    navigator.sendBeacon(getURL(), blob);
  }
}
