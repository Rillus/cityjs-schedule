import React from 'react';
import './Footer.scss';

const Footer = ({ data }) => {
  const modifiedLabel = data?.modified?.replace(' (Day 3 tracks from cityjsconf.org)', '');

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
          {modifiedLabel && (
            <>
              {`Data: ${modifiedLabel}`}
              {' · '}
            </>
          )}
          <a href="https://ticketlab.app" target="_blank" rel="noopener noreferrer">
            App by ticketlab.app
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 