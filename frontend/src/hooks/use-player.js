import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';

const playerContext = createContext();

export function ProvidePlayer({ children }) {
  const player = useProvidePlayer();

  return (
    <playerContext.Provider value={player}>{children}</playerContext.Provider>
  );
}

export const usePlayer = () => {
  return useContext(playerContext);
};

let startedPlaying = null;
// let pausedPlaying = new Date(0);
let timer = null;
let actions = [];
let actionIndex = 0;

function useProvidePlayer() {
  const [visit, setVisit] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [mousePosition, setMousePosition] = useState({ y: -20 });
  const [mouseDown, setMouseDown] = useState(false);
  // const [keys, setKeys] = useState([]);

  useEffect(() => {
    if (visit) {
      axios
        .get('/api/actions/?visit=' + visit)
        .then(response => {
          actions = response.data.results;
          // console.log(actions.slice(0, 10));

          const firstMouseMoveAction = actions.find(a => a.type === 'mm');
          if (firstMouseMoveAction) {
            playAction(firstMouseMoveAction);
          }
        });
    }
  }, [visit]);

  function play() {
    if (!playing && actions) {
      startedPlaying = new Date();
      timer = setInterval(playActions, 10);
      setPlaying(true);
      console.log('Started playing.');
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
    console.log('Finished playing.');
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
      // kd: value => setKeys(keys => keys.concat(value.key)),
      // ku: value => setKeys(keys => keys.filter(k => k !== value.key)),
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
    playAction(actions[0]); //TODO play first mouse move action only
    actionIndex = 0;
    setPlaying(false);
    console.log('Stopped playing.');
  }

  // TODO Pause logic
  function pause() {
    clearInterval(timer);
    setPlaying(false);
    console.log('Paused playing.');
  }

  return {
    visit,
    setVisit,
    playing,
    mouse: { position: mousePosition, down: mouseDown },
    // keys,
    play,
    pause,
    stop,
  };
}
