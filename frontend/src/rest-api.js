import axios from 'axios';

const API_BASE_PATH = '/api/';

export function postLogin(username, password) {
  return axios.post(API_BASE_PATH + 'auth/login/', { username, password });
}

export function getLogout() {
  return axios.get(API_BASE_PATH + 'auth/logout/');
}

export function getSiteList() {
  return axios.get(API_BASE_PATH + 'sites/').then(data => data.results);
}

export function getSite(id) {
  return axios.get(API_BASE_PATH + `sites/${id}/`);
}

export function getPage(id) {
  return axios.get(API_BASE_PATH + `pages/${id}/`);
}

export function deleteVisit(id) {
  return axios.delete(API_BASE_PATH + `visits/${id}/`);
}

export function getActionList(visitID, nextCursor) {
  let url = API_BASE_PATH + `visits/${visitID}/actions/`;
  if (nextCursor !== null) {
    url += '?cursor=' + nextCursor;
  }
  return axios.get(url);
}
