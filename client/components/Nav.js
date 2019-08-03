import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = props => {
  return (
    <>
      <Link to="/portfolio">Portfolio</Link>
      <Link to="/transactions">Transactions</Link>
    </>
  );
};

export default Navbar;
