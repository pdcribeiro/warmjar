import Cookie from 'js-cookie';
import { useEffect, useState } from 'react';

import { postLogin, getLogout } from '../rest-api';

export function useAuth() {
  const [user, setUser] = useState(undefined);

  useEffect(() => setUser(Cookie.get('user') || null), []);

  function login(username, password) {
    postLogin(username, password).then(user => setUser(user));
  }

  function logout() {
    getLogout().then(() => setUser(null));
  }

  // useEffect(() => console.log('user:', user), [user]);

  return { user, login, logout };
}
