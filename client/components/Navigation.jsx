import React from 'react';

import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <ul>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/demo">Demo</Link>
      </li>
      <li>
        <Link to="/offline">Offline</Link>
      </li>
    </ul>
  );
};

export default Navigation;
