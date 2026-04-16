import React from 'react';
import styles from './Maps.module.scss';

function Maps() {
  return (
    <main className={styles.Maps}>
      <header>
        <h1 className={styles.header}>Venue & travel</h1>
      </header>
      <div className={styles.info}>
        <p>
          Official schedule and venue details are published on the{' '}
          <a
            href="https://london.cityjsconf.org/schedule"
            target="_blank"
            rel="noopener noreferrer">
            CityJS London website
          </a>
          .
        </p>
        <p>
          Day 1 is listed as <strong>Tessl AI HQ</strong>; later days use multi-track rooms
          (Great Hall, Small Hall, and session rooms) as on the programme.
        </p>
        <p>
          For public transport in London, see{' '}
          <a href="https://tfl.gov.uk" target="_blank" rel="noopener noreferrer">
            Transport for London
          </a>
          .
        </p>
      </div>
    </main>
  );
}

export default Maps;
