import { Redirect } from '@reach/router';
import React from 'react';

import { Login } from './components/Login';
import { Main } from './components/Main';
import { useAnchorElements } from './hooks/use-anchor-elements';
import { useAuth } from './hooks/use-auth';
import { PlayerProvider } from './hooks/use-player.js';

function App() {
  const {user, login, logout} = useAuth();
  useAnchorElements();

  if (user === undefined) {
    return <h1>Loading...</h1>;
  }

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
      <Main logout={logout} />
    </PlayerProvider>
  );
}

export default App;
