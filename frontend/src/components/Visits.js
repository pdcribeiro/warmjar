import axios from 'axios';
import React, { useEffect } from 'react';
import styled from 'styled-components';

import { usePlayer } from '../hooks/use-player';

const Visit = styled.li`
  ${props => (props.selected ? 'background-color: lightgrey;' : '')}
  cursor: pointer;
`;

export function VisitList({ visits }) {
  const { visit, setVisit } = usePlayer();

  useEffect(() => () => setVisit(null), []);

  function handleClick(visit) {
    setVisit(prevVisit => (visit !== prevVisit ? visit : null));
  }

  return (
    <>
      <h2>Visits</h2>
      <ul>
        {visits.map(v => (
          <Visit
            selected={v.id === visit}
            key={v.id}
            onClick={() => handleClick(v.id)}
          >
            [{v.id}] {v.started}
          </Visit>
        ))}
      </ul>
    </>
  );
}
