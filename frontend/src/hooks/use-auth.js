import axios from 'axios';
import { useEffect, useState } from 'react';

export function useAuth() {
  const [loggedIn, setLoggedIn] = useState(null);

  useEffect(checkAuth, []);

  function checkAuth() {
    axios
      .get('/api/sites/')
      .then(() => setLoggedIn(true))
      .catch(() => setLoggedIn(false));
  }

  return { loggedIn, check: checkAuth };
}
