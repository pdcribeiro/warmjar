import axios from 'axios';
import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Login } from '../Login';

jest.mock('axios');

it('posts login data to api', () => {
  axios.post.mockResolvedValue();

  const { getByPlaceholderText, getByRole } = render(
    <Login onLogin={() => {}} />
  );
  expect(axios.post).not.toHaveBeenCalled();

  ['username', 'password'].forEach(field =>
    userEvent.type(getByPlaceholderText(new RegExp(field, 'i')), 'user')
  );

  userEvent.click(getByRole('button'));

  expect(axios.post).toHaveBeenCalledTimes(1);
  expect(axios.post.mock.calls[0][0]).toBe('/api/auth/login/');
});

// it('does not post to api if any field is empty', () => {
//   axios.post.mockResolvedValue();

//   const { getByRole } = render(<Login />);
  
//   userEvent.click(getByRole('button'));
//   expect(axios.post).not.toHaveBeenCalled();
// });
