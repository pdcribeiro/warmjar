import axios from 'axios';
import Cookies from 'js-cookie';
import { Redirect } from '@reach/router';
import React from 'react';

import { Login } from './components/Login';
import { Main } from './components/Main';
import { useAnchorElements } from './hooks/use-anchor-elements';
import { useAuth } from './hooks/use-auth';
import { PlayerProvider } from './hooks/use-player.js';

// Set csrf token after every response
axios.interceptors.response.use(
  function (response) {
    const csrfToken = Cookies.get('csrftoken');
    axios.defaults.headers.post['X-CSRFToken'] = csrfToken;
    axios.defaults.headers.delete['X-CSRFToken'] = csrfToken;
    return response;
  },
  function (error) {
    console.error('axios: ', error);
    return Promise.reject(error);
  }
);

function App() {
  const { user, login, logout } = useAuth();
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
