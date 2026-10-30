/**
 * Data needed to show one employee.
 * Later, these values can come from Microsoft 365 (for example a People Picker
 * selection or Microsoft Graph) without any change to the UI component.
 */
export interface IEmployeeProfileProps {
  displayName: string;
  jobTitle: string;
  /** Optional. When missing or broken, a fallback avatar with initials is shown. */
  photoUrl?: string;
  /** Shows a spinner instead of the photo while the profile is being fetched. */
  isLoading?: boolean;
}
