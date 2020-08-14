import React from 'react';

import { usePlayer } from '../../hooks/use-player';

export function PlayerControls() {
  const { playing, play, pause, stop } = usePlayer();

  return (
    <>
      {playing ? (
        <button onClick={pause}>Pause</button>
      ) : (
        <button onClick={play}>Play</button>
      )}
      <button onClick={stop}>Stop</button>
    </>
  );
}
