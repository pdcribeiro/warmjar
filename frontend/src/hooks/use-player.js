import React, { createContext, useContext, useEffect, useState } from 'react';

import { getActionList } from '../rest-api';

let startedPlaying = null;
// let pausedPlaying = new Date(0);
let timer = null;
let actionIndex = 0;

let visits = {};
let currentVisit = null;

function usePlayer() {
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [domString, setDOMString] = useState(null);
  const [mousePosition, setMousePosition] = useState({});
  const [mouseDown, setMouseDown] = useState(false);

  useEffect(() => {
    // console.log('new visit selected', selectedVisit);
    visits = {};
    if (selectedVisit) {
      // console.log('fetching actions...');
      fetchActions(selectedVisit).then(reset);
    } else {
      setDOMString(null);
    }
  }, [selectedVisit]);

  function fetchActions(visitID, recursionDepth = 0) {
    const isNewVisit = visits[visitID] === undefined;
    const visit = getVisit(visitID);

    return getActionList(visitID, visit.nextCursor).then(
      ({ dom, css, results, next, nextVisit }) => {
        dom && (visit.dom = dom);
        css && (visit.css = css);

        visit.actions = visit.actions.concat(results);

        // next && console.log('next cursor received', next);
        visit.nextCursor = next;

        if (nextVisit) {
          // console.log('next visit ID received', nextVisit);
          visit.nextVisit = nextVisit;
          if (isNewVisit && recursionDepth < 5) {
            fetchActions(nextVisit, recursionDepth + 1);
          }
        }
      }
    );
  }

  function getVisit(visitID) {
    if (visits[visitID] === undefined) {
      visits[visitID] = { actions: [], nextCursor: null, nextVisit: null };
    }
    return visits[visitID];
  }

  function reset() {
    // console.log('resetting...');
    currentVisit = selectedVisit;
    const { dom, actions } = getVisit(selectedVisit);
    setDOMString(dom);
    setMouseDown(false);
    const firstMouseMoveAction = actions.find(a => a.type === 'mm');
    if (firstMouseMoveAction) {
      playAction(firstMouseMoveAction);
    }
  }

  function play() {
    if (!playing) {
      startedPlaying = new Date();
      timer = setInterval(playActions, 10);
      setPlaying(true);
      // console.log('started playing');
    }
  }

  function playActions() {
    const { dom, actions, nextCursor, nextVisit } = getVisit(currentVisit);
    if (actionIndex === 0) {
      setDOMString(dom);
    }

    const action = getNextAction();
    if (action !== null) {
      // console.log('playing action...', action);
      playAction(action);

      if (actionIndex === Math.floor(0.75 * actions.length)) {
        // console.log('actions almost finished', currentVisit);
        fetchMoreActions(nextCursor, nextVisit);
      }
      // TODO check if autoplay is enabled and stop/continue playing accordingly.
      else if (actionIndex === actions.length - 1 && nextVisit) {
        switchToVisit(nextVisit);
        // console.log('switched to next visit', nextVisit);
      }
    }
  }

  function getNextAction() {
    const { actions } = getVisit(currentVisit);
    const now = new Date() - startedPlaying;

    for (; actionIndex < actions.length; actionIndex++) {
      const action = actions[actionIndex];

      // Wait until time to play action.
      if (now < action.performed) {
        return null;
      }

      if (action.type !== 'mm') {
        return action;
      }

      // Skip to the latest mouse move action.
      if (
        actionIndex === actions.length - 1 ||
        actions[actionIndex + 1].performed > now
      ) {
        return action;
      }
    }

    // Finished playing actions.
    // console.log('actions finished');
    clearInterval(timer);
    actionIndex = 0;
    setPlaying(false);
    return null;
  }

  function playAction(action) {
    // console.log('playing action...', action);
    const actionFunction = {
      mm: action => setMousePosition(action),
      md: () => setMouseDown(true),
      mu: () => setMouseDown(false),
    }[action.type];

    if (actionFunction) {
      actionFunction(action);
    } else {
      console.error('Action not supported.', action);
    }
    actionIndex++;
  }

  function fetchMoreActions(nextCursor, nextVisit) {
    if (nextCursor !== null) {
      // console.log('fetching more actions...', nextCursor, nextVisit);
      fetchActions(currentVisit);
    } else if (nextVisit !== null && !visits[nextVisit]?.actions) {
      // console.log('fetching next visit actions...', nextVisit);
      fetchActions(nextVisit);
    }
  }

  function switchToVisit(visitID) {
    currentVisit = visitID;
    startedPlaying = new Date();
    actionIndex = 0;
    setTimeout(() => setMouseDown(false), 100);
  }

  function stop() {
    clearInterval(timer);
    reset();
    actionIndex = 0;
    setPlaying(false);
    // console.log('stopped playing');
  }

  // TODO pause logic
  function pause() {
    if (playing) {
      clearInterval(timer);
      setPlaying(false);
      // console.log('paused playing');
    }
  }

  return {
    visit: selectedVisit,
    setVisit: setSelectedVisit,
    playing,
    dom: domString,
    mouse: { position: mousePosition, down: mouseDown },
    play,
    pause,
    stop,
  };
}

const playerContext = createContext();

export function PlayerProvider({ children }) {
  const player = usePlayer();

  return (
    <playerContext.Provider value={player}>{children}</playerContext.Provider>
  );
}

function usePlayerContext() {
  return useContext(playerContext);
}

export { usePlayerContext as usePlayer };
