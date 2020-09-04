import axios from 'axios';

export function postLogin(username, password) {
  return axios.post('/api/auth/login/', { username, password });
}

export function getUser() {
  return axios.get('/api/auth/');
}

export function getLogout() {
  return axios.get('/api/auth/logout/');
}

export function getSiteList() {
  return axios.get('/api/sites/').then(data => data.results);
}

export function getSite(id) {
  return axios.get(`/api/sites/${id}/`);
}

export function getPage(id) {
  return axios.get(`/api/pages/${id}/`);
}

export function deleteVisit(id) {
  return axios.delete(`/api/visits/${id}/`);
}

export function getActionList(visitID) {
  return axios.get(`/api/visits/${visitID}/actions/`).then(data => data.results);
}
