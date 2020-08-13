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
import { usePlayer } from './hooks/use-player.js';

const Styled = styled.div`
  ${'' /* display: flex;
  align-items: flex-start; */}
  padding: 0px 20px;
`;

function App() {
  const auth = useAuth();
  const { visit } = usePlayer();
  useAnchorElements();

  if (auth.loggedIn === null) {
    return <h1>Loading...</h1>;
  }

  if (!auth.loggedIn) {
    return (
      <>
        <Login checkAuth={auth.check} />
        <Redirect to="/login" noThrow />
      </>
    );
  }

  return (
    <>
      <Header checkAuth={auth.check} />
      <Styled>
        <Router>
          <Sites path="sites/*" />
          <PageDetail path="pages/:pageID" />

          <NotFound default />
          <Redirect from="/" to="/sites" noThrow />
          <Redirect from="/login" to="/sites" noThrow />
        </Router>
        {visit && <Player />}
      </Styled>
    </>
  );
}

function NotFound() {
  return <h1>Not found</h1>;
}

export default App;
