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

  useEffect(() => console.log('sites: ', sites), [sites]);

  return (
    <>
      <h2>Sites</h2>
      <ul>
        {sites.map(site => (
          <li key={site.id}>
            <a href={'/sites/' + site.id}>{site.url}</a>
          </li>
        ))}
      </ul>
    </>
  );
}

function SiteDetail({ siteID }) {
  const [site, setSite] = useState(null);

  useEffect(() => {
    axios.get('/api/sites/' + siteID).then(response => setSite(response.data));
  }, []);

  useEffect(() => console.log('site: ', site), [site]);

  if (site === null) {
    return <p>Loading...</p>;
  }

  const { url, pages, visits } = site;
  return (
    <>
      <h2>{url}</h2>
      <PageList pages={pages} />
      <VisitList visits={visits} />
    </>
  );
}
