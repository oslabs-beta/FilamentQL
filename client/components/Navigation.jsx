import React from 'react';

import { Link } from 'react-router-dom';

const Navigation = () => {
  return (

    <ul className='navUl' style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      listStyleType: 'none',
      textDecoration: 'none'

    }}>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/demo">Demo</Link>
      </li>
      {/* <li>
        <Link to="/offline">Offline</Link>
      </li> */}
      <li>
        <Link to="/team">Team</Link>
      </li>
      <li>
        <Link to="/info">Info</Link>
      </li>
      <li>
        <a href="https://github.com/oslabs-beta/Filament">GitHub</a>
      </li>
      <li>
        <Link to="/info">NPM Package</Link>
      </li>
    </ul>

  );
};

export default Navigation;
