import axios from 'axios';
import React from 'react';
import styled from 'styled-components';

const Styled = styled.div`
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: 10px 20px;
  ${'' /* background-color: hsl(25, 100%, 75%); */}
  border-bottom: 1px solid lightgrey;

  h1 {
    margin: 0;
    color: #333;
  }

  button {
    margin-left: auto;
  }
`;

export function Header({ onLogout }) {
  function logout() {
    axios.get('/api/auth/logout/').then(onLogout);
  }

  return (
    <Styled>
      <a href="/"><h1>Warmjar</h1></a>
      <button onClick={logout}>Logout</button>
    </Styled>
  );
}
