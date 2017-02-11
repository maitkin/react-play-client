import React from 'react';
import { IndexRoute, Route } from 'react-router';
import { TimersView } from './views/timers';

export default () => (
  <Route path="/">
    <IndexRoute component={TimersView}/>
    <Route path="*" component={TimersView}/>
  </Route>
);

