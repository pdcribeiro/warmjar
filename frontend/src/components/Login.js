import React, { useState } from 'react';
import styled from 'styled-components';

export function Login({ login }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(event) {
    if (username && password) {
      login(username, password);
    }
    event.preventDefault();
  }

  return (
    <StyledDiv>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          placeholder="username"
          required
          onChange={e => setUsername(e.target.value)}
        />
        <input
          type="password"
          value={password}
          placeholder="password"
          required
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
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
