import { Redirect } from '@reach/router';
import React from 'react';

import { Login } from './components/Login';
import { Main } from './components/Main';
import { useAnchorElements } from './hooks/use-anchor-elements';
import { useAuth } from './hooks/use-auth';
import { PlayerProvider } from './hooks/use-player.js';

function App() {
  const auth = useAuth();
  useAnchorElements();

  if (auth.user === undefined) {
    return <h1>Loading...</h1>;
  }

  if (auth.user === null) {
    return (
      <>
        <Login onLogin={auth.check} />
        <Redirect to="/login" noThrow />
      </>
    );
  }

  return (
    <PlayerProvider>
      <Main onLogout={auth.check} />
    </PlayerProvider>
  );
}

export default App;
