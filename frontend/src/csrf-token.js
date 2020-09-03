import axios from 'axios';
import Cookies from 'js-cookie';

export function getCSRFToken() {
  return axios
    .get('/api/')
    .then(() => {
      return Cookies.get('csrftoken');
    })
    .catch(error => console.error(error));
}
