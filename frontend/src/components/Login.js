import axios from 'axios';
import React from 'react';
import styled from 'styled-components';

import { useCSRFToken } from '../hooks/use-csrf-token';

const Styled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 25vh;

  form {
    display: flex;
    flex-direction: column;
  }

  input,
  button {
    margin: 10px 0;
  }
`;

export function Login({ checkAuth }) {
  const csrfToken = useCSRFToken();

  function handleSubmit(event) {
    const loginData = new FormData(event.target);
    const config = { headers: { 'Content-Type': 'multipart/form-data' } };
    axios
      .post('/api/auth/login/', loginData, config)
      .then(checkAuth)
      .catch(error => console.log(error));
    event.preventDefault();
  }

  return (
    <Styled>
      <form onSubmit={handleSubmit}>
        <input type="hidden" name="csrfmiddlewaretoken" value={csrfToken} />
        <input
          type="text"
          name="username"
          defaultValue="user"
          placeholder="username"
        />
        <input
          type="password"
          name="password"
          defaultValue="user"
          placeholder="password"
        />
        <input type="submit" value="Login" />
      </form>
    </Styled>
  );
}
