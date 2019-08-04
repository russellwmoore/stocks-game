import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = props => {
  return (
    <div>
      <Link to="/portfolio">Portfolio</Link>
      <Link to="/transactions">Transactions</Link>
    </div>
  );
};

export default Navbar;
