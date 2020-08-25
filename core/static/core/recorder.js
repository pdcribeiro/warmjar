var MAX_ACTIONS_LENGTH = 50;

var visitID = null;
var prevVisitID;
var actions = [];
var loaded = new Date();

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
  });

  if (actions.length == MAX_ACTIONS_LENGTH) {
    sendActions(actions.splice(0, MAX_ACTIONS_LENGTH));
  }
}

function sendActions(actions) {
  if (visitID) {
    var method = 'PATCH';
    // var url = `http://localhost:8000/api/visits/${visitID}/actions/`;
    var url = `http://localhost:8000/api/visits/${visitID}/`;
    var data = { actions };
  } else {
    var method = 'POST';
    // var url = `http://localhost:8000/api/actions/`;
    var url = `http://localhost:8000/api/visits/`;
    var data = { actions, url: window.location.href, previous: prevVisitID };
  }
  console.log(
    'sending actions...',
    { ...data, actions: [] },
    actions.slice(0, 5)
  );
  sendJSON(method, url, data)
    .then(handleNewVisitID)
    .catch(error => console.error('Failed to send actions.', error));
}

function sendJSON(method, url, data) {
  var req = new XMLHttpRequest();
  req.open(method, url);
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
  if (visitID) return;

  var { visit } = JSON.parse(response);
  if (visit) {
    visitID = visit;
    prevVisitID = null;
    sessionStorage.setItem('warmjar.visitID', visitID);
  }
}
