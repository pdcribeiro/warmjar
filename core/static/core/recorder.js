var MAX_ACTIONS_LENGTH = 50;

var visitID = null;
var prevVisitID = null;
var actions = [];
var loaded = new Date();

function init() {
  prevVisitID = sessionStorage.getItem('warmjar.visitID');
  startRecording();
}
init();

function startRecording() {
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mousedown', handleMouseDown);
  window.addEventListener('mouseup', handleMouseUp);
  // window.addEventListener('keydown', handleKeyDown);
  // window.addEventListener('keyup', handleKeyUp);
}

function stopRecording() {
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('mousedown', handleMouseDown);
  window.removeEventListener('mouseup', handleMouseUp);
  // window.removeEventListener('keydown', handleKeyDown);
  // window.removeEventListener('keyup', handleKeyUp);
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

/* function handleKeyDown(event) {
  createKeyAction('kd', event);
}
function handleKeyUp(event) {
  createKeyAction('ku', event);
}
function createKeyAction(type, event) {
  createAction(type, { key: event.key });
} */

function createAction(type, values) {
  actions.push({
    type,
    ...values,
    performed: new Date() - loaded,
    visit: visitID,
  });

  if (actions.length == MAX_ACTIONS_LENGTH) {
    sendActions(actions.splice(0, MAX_ACTIONS_LENGTH));
  }
}

function sendActions(actions) {
  var data = {
    actions,
    ...(!visitID && { url: window.location.href, previous: prevVisitID }),
  };
  console.log('sending actions...', {...data, actions: [], actionsSample: actions.slice(0, 5) });
  postJSON('http://localhost:8000/api/actions/', data)
    .then(handleNewVisitID)
    .catch(error => console.error('Failed to send actions.', error));
}

function postJSON(url, data) {
  var req = new XMLHttpRequest();
  req.open('POST', url);
  req.setRequestHeader('Content-Type', 'application/json');

  var promise = new Promise(function (resolve, reject) {
    req.onload = function () {
      resolve(JSON.parse(req.responseText));
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
  if (!visitID) {
    visitID = response.visit;
    for (var i = 0, len = actions.length; i < len; i++) {
      actions[i].visit = visitID;
    }
    prevVisitID = null;
    sessionStorage.setItem('warmjar.visitID', visitID);
  }
}
