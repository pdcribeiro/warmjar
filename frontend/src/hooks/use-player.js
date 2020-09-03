import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';

let startedPlaying = null;
// let pausedPlaying = new Date(0);
let timer = null;
let actions = [];
let actionIndex = 0;

function usePlayer() {
  const [visit, setVisit] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [mousePosition, setMousePosition] = useState({});
  const [mouseDown, setMouseDown] = useState(false);

  useEffect(() => {
    if (visit) {
      axios.get(`/api/visits/${visit}/actions/`).then(response => {
        actions = response.data.results;
        // console.log(actions.slice(0, 10));
        reset();
      });
    }
  }, [visit]);

  function reset() {
    setMouseDown(false);
    const firstMouseMoveAction = actions.find(a => a.type === 'mm');
    if (firstMouseMoveAction) {
      playAction(firstMouseMoveAction);
    }
  }

  function play() {
    if (!playing && actions) {
      startedPlaying = new Date();
      timer = setInterval(playActions, 10);
      setPlaying(true);
      // console.log('Started playing.');
    }
  }

  function playActions() {
    const action = getNextAction();
    if (action !== null) {
      // console.log('playing action...', action);
      playAction(action);
    }
  }

  function getNextAction() {
    const now = new Date() - startedPlaying;
    // console.log('now', now);

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
        actionIndex + 1 === actions.length ||
        actions[actionIndex + 1].performed > now
      ) {
        return action;
      }
    }

    // Finished playing actions.
    // console.log('Finished playing.');
    clearInterval(timer);
    actionIndex = 0;
    setPlaying(false);
    return null;
  }

  function playAction(action) {
    // console.log('playing action', action);
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

  function stop() {
    clearInterval(timer);
    reset();
    actionIndex = 0;
    setPlaying(false);
    // console.log('Stopped playing.');
  }

  // TODO pause logic
  function pause() {
    clearInterval(timer);
    setPlaying(false);
    // console.log('Paused playing.');
  }

  return {
    visit,
    setVisit,
    playing,
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
