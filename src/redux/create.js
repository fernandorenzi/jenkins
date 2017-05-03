import { applyMiddleware, createStore } from 'redux';

import clientMiddleware from './middleware/client';
import rootReducer from './reducers';
import user from './modules/user'
import build from './modules/build'
import builds from './modules/builds'
import jobs from './modules/jobs'

export default () => createStore(
  rootReducer,
  applyMiddleware(clientMiddleware)
);
