import axios from 'axios';
import React, { useEffect, useState } from 'react';

import { VisitList } from './Visits';

export function PageList({ pages }) {
  return (
    <>
      <h2>Pages</h2>
      <ul>
        {pages.map(page => (
          <li key={page.id}>
            <a href={'/pages/' + page.id}>{page.path}</a>
          </li>
        ))}
      </ul>
    </>
  );
}

export function PageDetail({ pageID }) {
  const [page, setPage] = useState(null);

  useEffect(() => {
    axios.get('/api/pages/' + pageID).then(response => setPage(response.data));
  }, []);

  // useEffect(() => console.log('page: ', page), [page]);

  if (page === null) {
    return <p>Loading...</p>;
  }

  const { path, visits } = page;
  return (
    <>
      <h2>{path}</h2>
      <VisitList visits={visits} />
    </>
  );
}
