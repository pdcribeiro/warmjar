import React, { useEffect } from 'react';
import styled from 'styled-components';

import { deleteVisit } from '../rest-api';
import { usePlayer } from '../hooks/use-player';

const Visit = styled.li`
  display: flex;
  ${props => (props.selected ? 'background-color: #eee;' : '')}
  cursor: pointer;
`;

const DeleteButton = styled.div`
  margin-left: 10px;
  font-weight: bolder;
  color: red;
`;

export function VisitList({ visits, onDelete }) {
  const { visit, setVisit } = usePlayer();

  useEffect(() => () => setVisit(null), [setVisit]);

  function selectVisit(visit) {
    setVisit(prevVisit => (visit !== prevVisit ? visit : null));
  }

  async function handleDelete(event, visitID) {
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
              onClick={() => selectVisit(v.id)}
            >
              [{v.id}] {v.started}
              <DeleteButton onClick={e => handleDelete(e, v.id)}>X</DeleteButton>
            </Visit>
          ))
        ) : (
          <li>Failed to fetch visits.</li>
        )}
      </ul>
    </>
  );
}
