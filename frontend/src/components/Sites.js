import { Router } from '@reach/router';
import React, { useEffect, useState } from 'react';

import { getSiteList, getSite } from '../rest-api';
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

export function SiteList() {
  const [sites, setSites] = useState([]);

  useEffect(() => {
    getSiteList()
      .then(siteList => setSites(siteList))
      .catch(() => setSites(null));
  }, []);

  // useEffect(() => console.log('sites: ', sites), [sites]);

  return (
    <>
      <h2>Sites</h2>
      <ul>
        {sites ? (
          sites.map(site => (
            <li key={site.id}>
              <a href={'/sites/' + site.id}>{site.url}</a>
            </li>
          ))
        ) : (
          <li>Failed to fetch sites.</li>
        )}
      </ul>
    </>
  );
}

export function SiteDetail({ siteID }) {
  const [site, setSite] = useState(null);

  useEffect(fetchSite, [siteID]);

  function fetchSite() {
    getSite(siteID).then(site => setSite(site));
  }

  // useEffect(() => console.log('site: ', site), [site]);

  if (site === null) {
    return <p>Loading...</p>;
  }

  const { url, pages, visits } = site;
  return (
    <>
      <h2>{url}</h2>
      <PageList pages={pages} />
      <VisitList visits={visits} onDelete={fetchSite} />
    </>
  );
}
