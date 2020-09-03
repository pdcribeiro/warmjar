import axios from 'axios';
import { useEffect, useState } from 'react';

export function useAuth() {
  const [user, setUser] = useState(undefined);

  useEffect(check, []);

  function check() {
    axios
      .get('/api/sites/')
      .then(() => setUser('user'))
      .catch(() => setUser(null));
  }

  // useEffect(() => console.log('user:', user), [user]);

  return { user, check };
}
