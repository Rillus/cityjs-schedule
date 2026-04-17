import { EventType } from "../../../types/act";
import styles from "./SessionDetail.module.scss";

function socialUrl(platform: "twitter" | "linkedin" | "bluesky", handle: string): string {
  const h = handle.trim().replace(/^@/, "");
  if (h.startsWith("http://") || h.startsWith("https://")) return h;
  if (platform === "twitter") return `https://twitter.com/${h}`;
  if (platform === "linkedin") return `https://www.linkedin.com/in/${h}/`;
  return `https://bsky.app/profile/${h}`;
}

export default function SessionDetail(props: { event: EventType }) {
  const e = props.event;
  const { description, speakerBio, image, twitter, linkedin, bluesky, url } = e;

  if (!description && !speakerBio && !image && !twitter && !linkedin && !bluesky) {
    return null;
  }

  const photoAlt = e.name.includes(" — ")
    ? `Photograph of ${e.name.split(" — ").pop()?.trim()}`
    : "";

  const paragraphs = (text: string) =>
    text.split(/\n\n+/).map((chunk, i) => (
      <p key={i} className={styles.SessionDetail_paragraph}>
        {chunk}
      </p>
    ));

  return (
    <section className={styles.SessionDetail} aria-label="Session details">
      {image ? (
        <img
          className={styles.SessionDetail_image}
          src={image}
          alt={photoAlt}
          width={160}
          height={160}
        />
      ) : null}

      {description ? (
        <div className={styles.SessionDetail_block}>
          <h2 className={styles.SessionDetail_heading}>About this session</h2>
          <div className={styles.SessionDetail_prose}>{paragraphs(description)}</div>
        </div>
      ) : null}

      {speakerBio ? (
        <div className={styles.SessionDetail_block}>
          <h2 className={styles.SessionDetail_heading}>About the speaker(s)</h2>
          <div className={styles.SessionDetail_prose}>{paragraphs(speakerBio)}</div>
        </div>
      ) : null}

      {(twitter || linkedin || bluesky) && (
        <ul className={styles.SessionDetail_socials}>
          {twitter ? (
            <li>
              <a href={socialUrl("twitter", twitter)} rel="noopener noreferrer" target="_blank">
                Twitter / X
              </a>
            </li>
          ) : null}
          {bluesky ? (
            <li>
              <a href={socialUrl("bluesky", bluesky)} rel="noopener noreferrer" target="_blank">
                Bluesky
              </a>
            </li>
          ) : null}
          {linkedin ? (
            <li>
              <a href={socialUrl("linkedin", linkedin)} rel="noopener noreferrer" target="_blank">
                LinkedIn
              </a>
            </li>
          ) : null}
        </ul>
      )}

      {url ? (
        <p className={styles.SessionDetail_official}>
          <a href={url} rel="noopener noreferrer" target="_blank">
            Official CityJS London speakers page
          </a>
        </p>
      ) : null}
    </section>
  );
}
