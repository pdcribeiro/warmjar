import axios from 'axios';
import Cookies from 'js-cookie';
import { Redirect, Router } from '@reach/router';
import React from 'react';
import styled from 'styled-components';

import { Header } from './components/Header';
import { Login } from './components/Login';
import { PageDetail } from './components/Pages';
import { Player } from './components/Player';
import { Sites } from './components/Sites';
import { useAnchorElements } from './hooks/use-anchor-elements';
import { useAuth } from './hooks/use-auth';
import { PlayerProvider } from './hooks/use-player.js';

export default function App() {
  const { user, login, logout } = useAuth();
  useAnchorElements();

  if (user === undefined) return null;

  if (user === null) {
    return (
      <>
        <Login login={login} />
        <Redirect to="/login" noThrow />
      </>
    );
  }

  return (
    <PlayerProvider>
      <Header logout={logout} />
      <StyledDiv>
        <Router style={{ width: 210 }}>
          <Sites path="sites/*" />
          <PageDetail path="pages/:pageID" />
          <NotFound default />
          <Redirect from="/" to="/sites" noThrow />
          <Redirect from="/login" to="/sites" noThrow />
        </Router>
        <Player />
      </StyledDiv>
    </PlayerProvider>
  );
}

const StyledDiv = styled.div`
  display: flex;
  justify-content: space-between;
  /* align-items: flex-start; */
  flex-wrap: wrap;
  padding: 0px 20px 20px;
`;

function NotFound() {
  return <h2>Not found</h2>;
}

// Set csrf token after every response
axios.interceptors.response.use(
  response => {
    const csrfToken = Cookies.get('csrftoken');
    axios.defaults.headers.post['X-CSRFToken'] = csrfToken;
    axios.defaults.headers.delete['X-CSRFToken'] = csrfToken;
    // console.log('axios', response.data);
    return response.data;
  },
  error => {
    console.error('axios', error);
    return Promise.reject(error);
  }
);
