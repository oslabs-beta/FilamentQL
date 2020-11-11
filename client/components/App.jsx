import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Navigation from './Navigation';
import Main from './Main';
import Demo from './Demo';
// import Offline from './Offline/Offline';
import Team from './Team';
import Info from './Info';

sessionStorage.clear();

const App = () => (
  <div className="App">
    <Navigation />
    <Switch>
      <Route path="/info" component={Info} />
      {/* <Route path="/offline" component={Offline} /> */}
      <Route path="/demo" component={Demo} />
      <Route path="/team" component={Team} />
      <Route path="/" component={Main} />
    </Switch>

  </div>
);

export default App;
