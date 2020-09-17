import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { deleteVisit } from '../rest-api';
import { usePlayer } from '../hooks/use-player';

export function VisitList({ visits, onDelete }) {
  const [hover, setHover] = useState(null);
  const { visit, setVisit } = usePlayer();

  useEffect(() => () => setVisit(null), [setVisit]);

  function selectVisit(visit) {
    setVisit(prevVisit => (visit !== prevVisit ? visit : null));
  }

  async function handleDelete(event, visitID) {
    setVisit(visit => (visitID === visit ? null : visit));
    deleteVisit(visitID).then(onDelete);
    event.stopPropagation();
  }

  return (
    <>
      <h2>Visits</h2>
      <ul>
        {visits ? (
          visits.map(v => (
            <Visit
              selected={v.id === visit}
              key={v.id}
              onMouseEnter={() => setHover(v.id)}
              onMouseLeave={() => setHover(null)}
              onClick={() => selectVisit(v.id)}
            >
              [{v.id}] {v.started.slice(0, 19).replace('T', ' ')}
              <DeleteButton
                className={v.id === hover ? 'hover' : ''}
                onClick={e => handleDelete(e, v.id)}
              >
                X
              </DeleteButton>
            </Visit>
          ))
        ) : (
          <li>Failed to fetch visits.</li>
        )}
      </ul>
    </>
  );
}

const Visit = styled.li`
  display: flex;
  width: 100%;
  background-color: ${props => (props.selected ? '#eee' : 'white')};
  padding: 6px 10px;
  cursor: pointer;

  &:hover {
    background-color: ${props => (props.selected ? '#eee' : '#f8f8f8')};
  }
`;

const DeleteButton = styled.div`
  margin-left: auto;
  font-weight: bolder;
  color: transparent;
  z-index: -1;

  &.hover {
    color: lightsalmon;
    z-index: initial;
  }
`;
