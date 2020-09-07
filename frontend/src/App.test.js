import axios from 'axios';
import Cookies from 'js-cookie';
import React from 'react';
import { render, wait } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from './App';

const AUTH = { data: { user: 'user' } };
const SITES = [
  { id: 1, url: 'site1.com' },
  { id: 2, url: 'site2.com' },
];

jest.mock('axios');

it('redirects anonymous user to login page', async () => {
  const { findByRole } = render(<App />);
  expect(await findByRole('button')).toHaveTextContent('Login');
});

it('logs user in', async () => {
  axios.post.mockResolvedValue(AUTH);
  axios.get.mockResolvedValue({ results: SITES });

  const { getByPlaceholderText, getByRole, findByRole } = render(<App />);

  ['username', 'password'].forEach(field =>
    userEvent.type(getByPlaceholderText(new RegExp(field, 'i')), 'user')
  );

  userEvent.click(getByRole('button'));

  expect(await findByRole('list'));
  await wait(() => expect(getByRole('button')).toHaveTextContent('Logout'));
});

it('redirects authenticated user to site list page', async () => {
  Cookies.set('user', 'user');

  const { getByRole, findByRole } = render(<App />);
  
  expect(await findByRole('button')).toHaveTextContent('Logout');
  // await wait(() => expect(getByRole('button')).toHaveTextContent('Logout'));
});

// it('redirects to site page when site is clicked', () => {
//   axios.get.mockResolvedValue(AUTH);

// });
