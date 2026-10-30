import * as React from 'react';
import styles from './StewardSpotlight.module.scss';
import type { IStewardSpotlightProps } from './IStewardSpotlightProps';
import EmployeeProfile from './EmployeeProfile/EmployeeProfile';
import LinkButton from './LinkButton';
import { useEmployeeProfile } from './useEmployeeProfile';

const StewardSpotlight: React.FC<IStewardSpotlightProps> = ({
  title,
  subtitle,
  description,
  nominateUrl,
  readMoreUrl,
  featuredEmployee,
  profileService
}) => {
  // The People Picker is limited to one person, so only the first item is used.
  const { status, profile } = useEmployeeProfile(profileService, featuredEmployee?.[0]);

  return (
    <section className={styles.stewardSpotlight} aria-labelledby="steward-spotlight-title">
      <header className={styles.header}>
        <div className={styles.headings}>
          <h2 id="steward-spotlight-title" className={styles.title}>{title}</h2>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
        <div className={styles.nominate}>
          <LinkButton text="Nominate a Steward" url={nominateUrl} iconName="ArrowUpRight8" />
        </div>
      </header>

      <article className={styles.card}>
        <div className={styles.profile}>
          {status === 'empty' ? (
            // Nothing selected yet: tell the page editor what to do.
            <EmployeeProfile displayName="No employee selected" jobTitle="Choose one in the property pane" />
          ) : (
            <EmployeeProfile {...profile} isLoading={status === 'loading'} />
          )}
        </div>
        <div className={styles.content}>
          <blockquote className={styles.description}>{description}</blockquote>
          <div className={styles.readMore}>
            <LinkButton text="Read More" url={readMoreUrl} iconName="Forward" />
          </div>
        </div>
      </article>
    </section>
  );
};

export default StewardSpotlight;
