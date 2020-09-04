import { useEffect, useState } from 'react';

import { getUser, postLogin, getLogout } from '../rest-api';

export function useAuth() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    getUser()
      .then(user => setUser(user || null));
  }, []);

  function login(username, password) {
    postLogin(username, password).then(user => setUser(user));
  }

  function logout() {
    getLogout().then(() => setUser(null));
  }

  useEffect(() => console.log('user:', user), [user]);

  return { user, login, logout };
}
