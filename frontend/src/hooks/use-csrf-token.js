import axios from 'axios';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

export function useCSRFToken() {
  const [csrfToken, setCSRFToken] = useState('');

  useEffect(() => {
    axios.get('/api/').then(() => {
      setCSRFToken(Cookies.get('csrftoken'));
    });
  }, []);

  // useEffect(() => {
  //   axios.defaults.headers.post['X-CSRFToken'] = csrfToken;
  //   axios.defaults.headers.delete['X-CSRFToken'] = csrfToken;
  // }, [csrfToken]);

  return csrfToken;
}
