/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'store/store';
import App from './App';
import './index.css';

// Material Dashboard 2 React Context Provider
import { MaterialUIControllerProvider } from 'context';
import { ErrorBoundary } from 'components/ErrorBoundary';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <HashRouter>
    <MaterialUIControllerProvider>
      <ErrorBoundary>
        <Provider store={store}>
          <App />
        </Provider>
      </ErrorBoundary>
    </MaterialUIControllerProvider>
  </HashRouter>,
);
