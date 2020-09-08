var MAX_ACTIONS_LENGTH = 50;

var visitID = null;
var prevVisitID;
var actions = [];
var loaded = new Date();
var unloading = false;

function init() {
  prevVisitID = sessionStorage.getItem('warmjar.visitID') || null;
  startRecording();
}
init();

function startRecording() {
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mousedown', handleMouseDown);
  window.addEventListener('mouseup', handleMouseUp);
  // window.addEventListener('keydown', handleKeyDown);
  // window.addEventListener('keyup', handleKeyUp);
  window.addEventListener('unload', handleUnload);
}

/* function stopRecording() {
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('mousedown', handleMouseDown);
  window.removeEventListener('mouseup', handleMouseUp);
  // window.removeEventListener('keydown', handleKeyDown);
  // window.removeEventListener('keyup', handleKeyUp);
  // window.removeEventListener('unload', handleUnload)
} */

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

/* function handleKeyDown(event) {
  createKeyAction('kd', event);
}
function handleKeyUp(event) {
  createKeyAction('ku', event);
}
function createKeyAction(type, event) {
  createAction(type, { key: event.key });
} */

function handleUnload() {
  unloading = true;
  sendActions(actions);
}

function createAction(type, values) {
  actions.push({
    type,
    ...values,
    performed: new Date() - loaded,
  });

  if (actions.length == MAX_ACTIONS_LENGTH) {
    sendActions(actions.splice(0, MAX_ACTIONS_LENGTH));
  }
}

function sendActions(actions) {
  var url = 'http://localhost:8000/api/visits/';
  var data = { actions };
  if (visitID) {
    url += visitID + '/';
  } else {
    data = { ...data, url: window.location.href, previous: prevVisitID };
  }
  console.log(
    'sending actions...',
    { ...data, actions: [] },
    actions.slice(0, 5)
  );
  sendJSON(url, data)
    .then(handleNewVisitID)
    .catch(error => console.error('Failed to send actions.', error));
}

function sendJSON(url, data) {
  // if (unloading) {
    var blob = new Blob([JSON.stringify(data)], { type: 'text/plain' });
    navigator.sendBeacon(url, blob);
    return;
  // }

  var req = new XMLHttpRequest();
  req.open('POST', url);
  req.setRequestHeader('Content-Type', 'application/json');

  var promise = new Promise(function (resolve, reject) {
    req.onload = function () {
      resolve(req.responseText);
    };
    req.onerror = function () {
      reject('Request failed.');
    };
    setTimeout(function () {
      reject('Request timed out.');
    }, 5000);
  });

  req.send(JSON.stringify(data));

  return promise;
}

function handleNewVisitID(response) {
  console.log('Sent actions. Server replied with:', response);
  if (visitID || unloading) return;

  var { visit } = JSON.parse(response);
  if (visit) {
    visitID = visit;
    prevVisitID = null;
    sessionStorage.setItem('warmjar.visitID', visitID);
  }
}
