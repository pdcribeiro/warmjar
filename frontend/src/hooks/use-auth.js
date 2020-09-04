import axios from 'axios';
import { useEffect, useState } from 'react';

export function useAuth() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    axios
      .get('/api/auth/')
      .then(data => setUser(data.user))  // try without data.
      .catch(() => setUser(null));
  }, []);

  function login(username, password) {
    if (username && password) {
      axios
        .post('/api/auth/login/', { username, password })
        .then(data => setUser(data.user));
    }
  }

  function logout() {
    axios.get('/api/auth/logout/').then(() => setUser(null));
  }

  // useEffect(() => console.log('user:', user), [user]);

  return { user, login, logout };
}
