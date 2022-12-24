import React from 'react';
import { BrowserRouter, Switch} from 'react-router-dom';

import PublicRoute from './publicRoute';

import Home from  './pages/home';

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <PublicRoute path="/:uuid?" component={Home} />
      </Switch>
    </BrowserRouter>
  )
}