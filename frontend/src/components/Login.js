import axios from 'axios';
import React, { useRef } from 'react';
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
  const formRef = useRef(null);
  const csrfToken = useCSRFToken();

  function login() {
    const loginData = new FormData(formRef.current);
    const config = { headers: { 'Content-Type': 'multipart/form-data' } };
    axios
      .post('/api/auth/login/', loginData, config)
      .then(checkAuth)
      .catch(error => console.log(error));
  }

  return (
    <Styled>
      <form action="" ref={formRef}>
        <input type="hidden" name="csrfmiddlewaretoken" value={csrfToken} />
        <input
          type="text"
          name="username"
          defaultValue="user1"
          placeholder="Username"
        />
        <input
          type="password"
          name="password"
          defaultValue="useruser"
          placeholder="Password"
        />
      </form>
      <button onClick={login}>Login</button>
    </Styled>
  );
}
