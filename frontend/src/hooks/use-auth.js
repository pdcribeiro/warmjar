import axios from 'axios';
import { useEffect, useState } from 'react';

export function useAuth() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    axios
      .get('/api/auth/')
      .then(response => setUser(response.data.user))
      .catch(() => setUser(null));
  }, []);

  function login(username, password, csrfToken) {
    if (username && password && csrfToken) {
      const config = { headers: { 'X-CSRFToken': csrfToken } };
      axios
        .post('/api/auth/login/', { username, password }, config)
        .then(response => setUser(response.data.user))
        .catch(error => console.log(error));
    }
  }

  function logout() {
    axios
      .get('/api/auth/logout/')
      .then(() => setUser(null))
      .catch(error => console.log(error));
  }

  // useEffect(() => console.log('user:', user), [user]);

  return { user, login, logout };
}
