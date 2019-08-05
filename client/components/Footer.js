import React from 'react';

const Footer = props => {
  return (
    <div id="footer">
      Data provided for free by{' '}
      <span className="footer-link">
        <a target="_blank" href="https://iextrading.com/developer">
          IEX
        </a>
      </span>
      .{' '}
      <span className="footer-link">
        <a target="_blank" href="https://iextrading.com/api-exhibit-a/">
          View IEX’s Terms of Use.
        </a>
      </span>
    </div>
  );
};

export default Footer;
