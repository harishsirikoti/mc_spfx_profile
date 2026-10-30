import * as React from 'react';
import { PrimaryButton } from '@fluentui/react';
import { getSafeUrl } from '../utils/urlValidation';
import { linkButtonStyles } from './linkButtonStyles';

export interface ILinkButtonProps {
  text: string;
  url: string;
  iconName: string;
}

/**
 * A button that opens a link in a new tab.
 * The link is only rendered when the URL is safe; otherwise the button is disabled.
 */
const LinkButton: React.FC<ILinkButtonProps> = ({ text, url, iconName }) => {
  const safeUrl: string | undefined = getSafeUrl(url);

  return (
    <PrimaryButton
      text={text}
      href={safeUrl}
      target={safeUrl ? '_blank' : undefined}
      rel={safeUrl ? 'noopener noreferrer' : undefined}
      disabled={!safeUrl}
      iconProps={{ iconName }}
      styles={linkButtonStyles}
    />
  );
};

export default LinkButton;
