import React from 'react';

let recording = false;
let loaded = null;

export let actions = null;
actions = [
  { type: 'mm', value: { x: 143, y: 489 }, recorded: 0 },
  { type: 'md', value: { x: 143, y: 489 }, recorded: 0 },
];

export const Recorder = () => <button onClick={handleClick}>Rec</button>;

function handleClick() {
  recording = !recording;
  if (recording) {
    actions = [];
    loaded = new Date();
    startRecording();
    console.log('started recording.');
  } else {
    stopRecording();
    console.log('stopped recording.');
  }
}

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
    left: event.clientX / window.innerWidth,
    top: event.clientY / window.innerHeight,
  });
}

// function handleKeyDown(event) {
//   createKeyAction('kd', event);
// }
// function handleKeyUp(event) {
//   createKeyAction('ku', event);
// }
// function createKeyAction(type, event) {
//   createAction(type, { key: event.key });
// }

function createAction(type, value) {
  actions.push({
    type,
    value,
    recorded: new Date() - loaded,
  });
}
