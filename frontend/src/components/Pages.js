import axios from 'axios';
import React, { useEffect, useState } from 'react';

import { VisitList } from './Visits';

export function PageList({ siteID }) {
  const [pages, setPages] = useState([]);

  useEffect(() => {
    axios
      .get('/api/pages?site=' + siteID)
      .then(response => setPages(response.data.results));
  }, [siteID]);

  return (
    <>
      <h2>Pages</h2>
      <ul>
        {pages.map(page => (
          <li key={page.id}>
            <a href={page.url.replace('api/', '').replace(':8000', ':3000')}>
              {page.page_url}
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}

export function PageDetail({ pageID }) {
  return (
    <>
      {/* TODO Page info */}
      <VisitList pageID={pageID} />
    </>
  );
}
