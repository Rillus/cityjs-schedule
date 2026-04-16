import React from 'react';
import styles from './Maps.module.scss';

/** OpenStreetMap embed: Kensington Town Hall, Hornton Street W8 7NX */
const VENUE_MAP_EMBED_SRC =
  'https://www.openstreetmap.org/export/embed.html?bbox=-0.1970%2C51.5010%2C-0.1900%2C51.5045&layer=mapnik&marker=51.50265%2C-0.19345';

const VENUE_MAP_LINK =
  'https://www.openstreetmap.org/?mlat=51.50265&mlon=-0.19345#map=18/51.50265/-0.19345';

const RBKC_VENUE_PAGE =
  'https://www.rbkc.gov.uk/venues-in-kensington-and-chelsea/kensington-conference-and-events-centre';

const RIBA_FIRST_FLOOR_PLAN =
  'https://www.ribapix.com/kensington-chelsea-town-hall-hornton-street-kensington-london-first-floor-plan_riba135315';

const RIBA_SITE_PLAN =
  'https://www.ribapix.com/kensington-chelsea-town-hall-hornton-street-kensington-london-site-plan_riba135313';

function Maps() {
  return (
    <main className={styles.Maps}>
      <header>
        <h1 className={styles.header}>Kensington Town Hall</h1>
        <p className={styles.lead}>
          <strong>Kensington Conference and Events Centre</strong>
          <br />
          Hornton Street, London, W8 7NX
        </p>
      </header>

      <section className={styles.section} aria-labelledby="map-heading">
        <h2 id="map-heading" className={styles.subheading}>
          Location map
        </h2>
        <div className={styles.mapEmbedWrap}>
          <iframe
            className={styles.mapEmbed}
            title="Map of Kensington Town Hall and surrounding streets (OpenStreetMap)"
            src={VENUE_MAP_EMBED_SRC}
            loading="lazy"
          />
        </div>
        <p className={styles.mapCaption}>
          <a href={VENUE_MAP_LINK} target="_blank" rel="noopener noreferrer">
            Open this map on OpenStreetMap
          </a>
        </p>
      </section>

      <div className={styles.info}>
        <section className={styles.section} aria-labelledby="official-heading">
          <h2 id="official-heading" className={styles.subheading}>
            Official venue details
          </h2>
          <p>
            Directions, car park access, and the council&apos;s 3D tour of the building are on the{' '}
            <a href={RBKC_VENUE_PAGE} target="_blank" rel="noopener noreferrer">
              Kensington Conference and Events Centre on the Royal Borough website
            </a>
            . Nearest tube: <strong>High Street Kensington</strong> (Circle and District lines) — about a
            two-minute walk up Hornton Street.
          </p>
        </section>

        <section className={styles.section} aria-labelledby="travel-heading">
          <h2 id="travel-heading" className={styles.subheading}>
            Public transport
          </h2>
          <p>
            For live travel in London, see{' '}
            <a href="https://tfl.gov.uk" target="_blank" rel="noopener noreferrer">
              Transport for London
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}

export default Maps;
