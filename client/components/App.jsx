import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';

import Test from './Test';
import Demo from './Demo';
import Offline from './Offline';

sessionStorage.clear();

const App = () => (
  <div className='App'>
    <Switch>
      <Route path='/offline' component={Offline} />
      <Route path='/demo' component={Demo} />
      <Route path='/' component={Test} />
    </Switch>
  </div>
);

export default App;
