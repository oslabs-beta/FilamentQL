import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Navigation from './Navigation';
import Main from './Main';
import Demo from './Demo';
import Offline from './Offline';

sessionStorage.clear();

const App = () => (
  <div className="App">
    <Navigation />
    <Switch>
      <Route path="/offline" component={Offline} />
      <Route path="/demo" component={Demo} />
      <Route path="/" component={Main} />
    </Switch>
  </div>
);

export default App;
