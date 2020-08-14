import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { usePlayer } from '../hooks/use-player';

export function VisitList({ siteID, pageID }) {
  const [visits, setVisits] = useState([]);
  const { visit, setVisit } = usePlayer();

  useEffect(() => {
    let query = '';
    if (siteID) query = 'site=' + siteID;
    else if (pageID) query = 'page=' + pageID;
    axios
      .get('/api/visits?' + query)
      .then(response => setVisits(response.data.results));
  }, [siteID, pageID]);

  function handleClick(visit) {
    setVisit(prevVisit => (visit !== prevVisit ? visit : null));
  }

  return (
    <>
      <h2>Visits</h2>
      <ul>
        {visits.map(v => (
          <li
            key={v.id}
            onClick={() => handleClick(v.id)}
            style={{
              backgroundColor: v.id === visit ? 'lightgrey' : '',
              cursor: 'pointer',
            }}
          >
            Page '{v.page}' on {v.started}
          </li>
        ))}
      </ul>
    </>
  );
}
