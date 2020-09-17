import React from 'react';
import styled from 'styled-components';

export function Header({ logout }) {
  return (
    <StyledDiv>
      <a href="/">
        <h1>Warmjar</h1>
      </a>
      <button onClick={logout}>Logout</button>
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: 10px 20px;
  ${'' /* background-color: hsl(25, 100%, 75%); */}
  border-bottom: 1px solid lightgrey;

  h1 {
    margin: 0;
    color: black;
  }

  button {
    margin-left: auto;
  }
`;
