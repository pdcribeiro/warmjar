const ACTIONS_LENGTH_TRIGGER = 50;
const BASE_URL = 'http://warmjar.ddns.net/api/visits/';
const MEDIA_TYPE = 'text/plain';

let visitID = null;
let actions = [];
let loaded = new Date();

function init() {
  document.addEventListener('DOMContentLoaded', setup);
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mousedown', handleMouseDown);
  window.addEventListener('mouseup', handleMouseUp);
  window.addEventListener('unload', handleUnload);
}
init();

async function setup() {
  let previous = sessionStorage.getItem('warmjar.visitID') || null;
  let dom = new XMLSerializer().serializeToString(document);
  // let dom = document.documentElement.outerHTML;

  // const { css, stylesheets } = await getCSS();
  // console.log(css.slice(0, 50), stylesheets);

  let data = { url: window.location.href, previous, dom }; //, css, stylesheets };
  // console.log('fetching visit id...', data);
  postJSON(BASE_URL, data)
    .then(({ visit }) => {
      // console.log('visitID:', visit);
      visitID = visit;
      sessionStorage.setItem('warmjar.visitID', visit);
    })
    .catch(error => console.error('Failed to send initial state.', error));
}

function getCSS() {
  let public = [];
  let private = [];
  Array.from(document.styleSheets).map(sheet => {
    if (sheet.href) {
      if (sheet.href.indexOf(window.location.origin) === 0) {
        private.push(sheet.href);
      } else {
        public.push(sheet.href);
      }
      // TODO handle private CDNs
    }
  });

  return Promise.all(
    private.map(url => fetch(url).then(resp => resp.text()))
  ).then(sheets => ({
    css: sheets.join('\n'),
    stylesheets: public,
  }));
}

function postJSON(url, data) {
  let req = new XMLHttpRequest();
  req.open('POST', url);
  req.setRequestHeader('Content-Type', MEDIA_TYPE);

  let promise = new Promise((resolve, reject) => {
    req.onload = () => {
      if (200 <= req.status <= 299) {
        resolve(JSON.parse(req.responseText));
      }
      reject('Request failed (' + req.status + ').');
    };
    req.onerror = () => reject('Request failed (' + req.status + ').');
    setTimeout(() => reject('Request timed out.'), 5000);
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
    let blob = new Blob([JSON.stringify({ actions })], { type: MEDIA_TYPE });
    navigator.sendBeacon(getURL(), blob);
  }
}
