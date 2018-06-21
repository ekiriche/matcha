import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import './App.css';

import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { setAuthorizationToken } from './client/singin/components/library/setAuthorizationToken';

setAuthorizationToken(localStorage.jwtToken);
ReactDOM.render(<App />, document.getElementById('root'));

registerServiceWorker();
