import React from 'react';
import styled from 'styled-components';

import { usePlayer } from '../hooks/use-player';
import cursor from './cursor.svg';

const Cursor = styled.div`
  width: 20px;
  height: 20px;
  background-image: url('${cursor}');
  position: absolute;
  top: ${props => props.position.y + 'px'};
  left: ${props => props.position.x + 'px'};

  &::after {
    display: block;
    width: 1px;
    height: 1px;
    border-radius: 50%;
    content: '';
    z-index: -1;
    ${'' /* transition: 0.1s; */}

    ${props =>
      props.down &&
      `
      background-color: #f005;
      transform: scale(40);
      transition: 0s;
    `}
  }
`;

// const Keys = styled.ul`
//   display: flex;
//   list-style: none;
//   color: white;
//   position: absolute;

//   li {
//     margin: 0 10px;
//   }
// `;

export function Player() {
  const player = usePlayer();
  // console.log('mouse state', player.mouse);

  return (
    <>
      {player.playing ? (
        <button onClick={player.pause}>Pause</button>
      ) : (
        <button onClick={player.play}>Play</button>
      )}
      <button onClick={player.stop}>Stop</button>
      <div style={{ zIndex: 1 }}>
        <Cursor {...player.mouse} />
      </div>
      {/* <Keys>
        {keys.map((key, idx) => (
          <li key={idx}>{key}</li>
        ))}
      </Keys> */}
    </>
  );
}
