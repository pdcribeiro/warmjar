import axios from 'axios';
import { Router } from '@reach/router';
import React, { useEffect, useState } from 'react';

import { PageList } from './Pages';
import { VisitList } from './Visits';

export function Sites() {
  return (
    <Router>
      <SiteList path="/" />
      <SiteDetail path=":siteID" />
    </Router>
  );
}

function SiteList() {
  const [sites, setSites] = useState([]);

  useEffect(() => {
    axios.get('/api/sites/').then(response => setSites(response.data.results));
  }, []);

  return (
    <>
      <h2>Sites</h2>
      <ul>
        {sites.map(site => (
          <li key={site.id}>
            <a href={site.url.replace('api/', '').replace(':8000', ':3000')}>
              {site.name}
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}

function SiteDetail({ siteID }) {
  return (
    <>
      {/* TODO Site info */}
      <PageList siteID={siteID} />
      <VisitList siteID={siteID} />
    </>
  );
}
