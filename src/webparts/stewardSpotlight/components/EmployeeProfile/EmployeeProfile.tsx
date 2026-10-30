import * as React from 'react';
import { Spinner, SpinnerSize, type ISpinnerStyles } from '@fluentui/react';
import styles from './EmployeeProfile.module.scss';
import type { IEmployeeProfileProps } from './IEmployeeProfileProps';
import { getSafeUrl } from '../../utils/urlValidation';

/** Builds up to two initials from a display name, e.g. "Lowe Gideon" -> "LG". */
function getInitials(displayName: string): string {
  return displayName
    .split(/\s+/)
    .filter((part: string) => part.length > 0)
    .slice(0, 2)
    .map((part: string) => part.charAt(0).toUpperCase())
    .join('');
}

// White spinner so it is visible on the dark blue avatar background.
const spinnerStyles: ISpinnerStyles = {
  circle: { borderColor: '#ffffff rgba(255,255,255,0.3) rgba(255,255,255,0.3) rgba(255,255,255,0.3)' },
  label: { color: '#ffffff', fontSize: 12 }
};

const EmployeeProfile: React.FC<IEmployeeProfileProps> = ({ displayName, jobTitle, photoUrl, isLoading }) => {
  // Remember which photo failed, so a new photo URL gets a fresh try.
  const [failedPhotoUrl, setFailedPhotoUrl] = React.useState<string | undefined>(undefined);

  const safePhotoUrl: string | undefined = getSafeUrl(photoUrl);
  const showPhoto: boolean = !!safePhotoUrl && safePhotoUrl !== failedPhotoUrl;

  return (
    <div className={styles.employeeProfile}>
      <div className={styles.photoArea}>
        {isLoading ? (
          <div className={styles.fallbackAvatar} role="status">
            <Spinner size={SpinnerSize.large} label="Loading profile" labelPosition="bottom" styles={spinnerStyles} />
          </div>
        ) : showPhoto ? (
          <img
            className={styles.photo}
            src={safePhotoUrl}
            alt={displayName}
            onError={() => setFailedPhotoUrl(safePhotoUrl)}
          />
        ) : (
          // Fallback avatar: shown when there is no photo or the photo cannot be loaded.
          <div className={styles.fallbackAvatar} role="img" aria-label={displayName}>
            <span aria-hidden="true">{getInitials(displayName)}</span>
          </div>
        )}
      </div>
      <div className={styles.accentLine} aria-hidden="true" />
      <div className={styles.details}>
        <p className={styles.displayName}>{displayName}</p>
        <p className={styles.jobTitle}>{jobTitle}</p>
      </div>
    </div>
  );
};

export default EmployeeProfile;
