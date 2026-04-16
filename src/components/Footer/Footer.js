import React from 'react';
import './Footer.scss';

const Footer = ({ data }) => {
  return (
    <footer className="Footer">
      <div className="Footer-content">
        <div className="Footer-left">
          v2.6 {' '}
          <a
            href="https://london.cityjsconf.org/schedule"
            target="_blank"
            rel="noopener noreferrer">
            Official CityJS schedule
          </a>
        </div>
        <div className="Footer-right">
          {data?.modified && `Data: ${data.modified}`}
        </div>
      </div>
    </footer>
  );
};

export default Footer; 