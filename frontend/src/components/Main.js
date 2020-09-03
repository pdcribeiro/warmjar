import { Redirect, Router } from '@reach/router';
import React from 'react';
import styled from 'styled-components';

import { Header } from './Header';
import { PageDetail } from './Pages';
import { Player } from './Player';
import { Sites } from './Sites';
import { usePlayer } from '../hooks/use-player.js';

const Styled = styled.div`
  display: flex;
  justify-content: space-between;
  /* align-items: flex-start; */
  flex-wrap: wrap;
  padding: 0px 20px 20px;

  > div:not(:last-child) {
    margin-right: 20px;
  }
`;

export function Main({onLogout}) {
  const { visit } = usePlayer();

  return (
    <>
      <Header onLogout={onLogout} />
      <Styled>
        <Router>
        {/* <Router style={{ width: '100%' }}> */}
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
  return <h2>Not found</h2>;
}
