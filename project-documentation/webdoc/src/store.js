// src/store.js
import { createStore } from 'redux';

// Définissez ici l'état initial attendu par le thème openapi-docs
const initialState = {
  server: {
    url: 'http://localhost:3001',
  },
  contentType: {
    selected: 'application/json',
    available: ['application/json', 'application/xml'],
  },
  accept: {
    selected: 'application/json',
    available: ['application/json', 'application/xml'],
  },
  request: {
    method: 'GET',
    url: '',
    headers: {},
    body: '',
  },
  response: {
    status: 0,
    headers: {},
    body: '',
  },
  history: [],
  historyIndex: -1,
  isFetching: false,
  error: null,
};

function reducer(state = initialState, action) {
  // Pour l'instant, nous ne gérons aucune action particulière
  return state;
}

const store = createStore(reducer);

export default store;
