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
      <li>
        <Link to="/team">Team</Link>
      </li>
      <li>
        <Link to="/info">Info</Link>
      </li>
      <li>
        <a target="_blank" href="https://github.com/oslabs-beta/Filament">GitHub</a>
      </li>
      <li>
        <a target="_blank" href="https://www.npmjs.com/package/filamentql">NPM Package</a>
      </li>
    </ul>

  );
};

export default Navigation;
