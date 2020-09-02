import axios from 'axios';
import React from 'react';
import { render } from '@testing-library/react';

import { SiteDetail, SiteList } from '../Sites';

jest.mock('axios');

afterEach(() => {
  axios.get.mockClear();
});

it('fetches and displays sites', async () => {
  const SITES = [
    { id: 1, url: 'site1.com' },
    { id: 2, url: 'site2.com' },
  ];
  axios.get.mockResolvedValue({ data: { results: SITES } });

  const { findAllByRole } = render(<SiteList />);
  
  expect(axios.get.mock.calls.length).toBe(1);

  const items = await findAllByRole('link');
  expect(items).toHaveLength(2);
  SITES.forEach((site, i) => {
    expect(items[i]).toHaveAttribute('href', '/sites/' + site.id);
    expect(items[i]).toHaveTextContent(site.url);
  });
});

it('displays error message when fails to fetch sites', async () => {
  axios.get.mockRejectedValue(new Error());

  const { findAllByRole, queryByRole } = render(<SiteList />);

  expect(axios.get.mock.calls.length).toBe(1);

  const items = await findAllByRole('listitem');
  expect(items).toHaveLength(1);
  expect(items[0]).toHaveTextContent('Failed to fetch sites.');

  expect(queryByRole('link')).toBeNull();
});

// it('should fetch and display site data', async () => {
//   const site = {
//     url: 'site1.com',
//     pages: [
//       { id: 1, path: 'page1' },
//       { id: 2, path: 'page1/subpage1' },
//       { id: 3, path: 'page2' },
//     ],
//     visits: [],
//   };
//   axios.get.mockResolvedValue({ data: site });

//   const { findAllByRole } = render(<SiteDetail siteID="1" />);

//   const lists = await findAllByRole('list');
//   expect(lists).toHaveLength(2);
// });

// it('should fail to fetch site data and display error message', async () => {
//   axios.get.mockRejectedValue(new Error());

//   const { findAllByRole, queryByRole } = render(<SiteList />);

//   const items = await findAllByRole('listitem');
//   expect(items).toHaveLength(1);
//   expect(items[0]).toHaveTextContent('Failed to fetch sites.');
//   expect(queryByRole('link')).toBeNull();
// });
