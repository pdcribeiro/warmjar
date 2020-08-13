import axios from 'axios';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

export function useCSRFToken() {
  const [csrfToken, setCSRFToken] = useState('');

  useEffect(() => {
    // if (process.env.NODE_ENV === 'production') {
    //   setCSRFToken(Cookies.get('csrftoken'));
    //   // csrfToken = Cookies.get('csrftoken');
    // } else {
      axios.get('/api/').then(() => {
        setCSRFToken(Cookies.get('csrftoken'));
        // csrfToken = Cookies.get('csrftoken');
      });
    // }
  });

  return csrfToken;
}
