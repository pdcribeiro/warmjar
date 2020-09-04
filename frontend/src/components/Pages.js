import React, { useEffect, useState } from 'react';

import { getPage } from '../rest-api';
import { VisitList } from './Visits';

export function PageList({ pages }) {
  return (
    <>
      <h2>Pages</h2>
      <ul>
        {pages ? (
          pages.map(page => (
            <li key={page.id}>
              <a href={'/pages/' + page.id}>{page.path}</a>
            </li>
          ))
        ) : (
          <li>Failed to fetch pages.</li>
        )}
      </ul>
    </>
  );
}

export function PageDetail({ pageID }) {
  const [page, setPage] = useState(null);

  useEffect(fetchPage, [pageID]);

  function fetchPage() {
    getPage(pageID).then(page => setPage(page));
  }

  // useEffect(() => console.log('page: ', page), [page]);

  if (page === null) {
    return <p>Loading...</p>;
  }

  const { path, visits } = page;
  return (
    <>
      <h2>{path}</h2>
      <VisitList visits={visits} onDelete={fetchPage} />
    </>
  );
}
