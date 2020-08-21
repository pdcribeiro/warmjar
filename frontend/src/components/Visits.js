import axios from 'axios';
import React, { useEffect } from 'react';
import styled from 'styled-components';

import { usePlayer } from '../hooks/use-player';
import { useCSRFToken } from '../hooks/use-csrf-token';

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

export function VisitList({ visits }) {
  const { visit, setVisit } = usePlayer();
  const csrfToken = useCSRFToken();

  useEffect(() => () => setVisit(null), []);

  function selectVisit(visit) {
    setVisit(prevVisit => (visit !== prevVisit ? visit : null));
  }

  function deleteVisit(event, visit) {
    const config = { headers: { 'X-CSRFToken': csrfToken } };
    axios
      .delete(`/api/visits/${visit}/`, config)
      .catch(error => console.error(error));
    event.stopPropagation();
  }

  return (
    <>
      <h2 onClick={() => deleteVisit(7)}>Visits</h2>
      <ul>
        {visits.map(v => (
          <Visit
            selected={v.id === visit}
            key={v.id}
            onClick={() => selectVisit(v.id)}
          >
            [{v.id}] {v.started}
            <DeleteButton onClick={e => deleteVisit(e, v.id)}>X</DeleteButton>
          </Visit>
        ))}
      </ul>
    </>
  );
}
