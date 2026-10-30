import type { IButtonStyles } from '@fluentui/react';

// Rounded blue "pill" button used for "Nominate a Steward" and "Read More".
// The icon is shown after the text, so the content row is reversed.
export const linkButtonStyles: IButtonStyles = {
  root: {
    height: 'auto',
    minWidth: 0,
    padding: '10px 20px',
    borderRadius: 999,
    border: '1px solid #3b5fd0',
    backgroundColor: '#1d3fb0',
    color: '#ffffff',
    fontWeight: 600,
    fontSize: 14
  },
  rootHovered: { backgroundColor: '#2a4fc8', color: '#ffffff' },
  rootPressed: { backgroundColor: '#17338f', color: '#ffffff' },
  rootDisabled: { backgroundColor: '#3a4470', borderColor: '#4a5486', color: '#aab2d4' },
  flexContainer: { flexDirection: 'row-reverse' },
  icon: { margin: '0 0 0 8px', fontSize: 12, color: 'inherit' },
  label: { margin: 0, fontWeight: 600 }
};
