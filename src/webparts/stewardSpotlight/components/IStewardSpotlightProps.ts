import type { IPropertyFieldGroupOrPerson } from '@pnp/spfx-property-controls/lib/PropertyFieldPeoplePicker';
import type { EmployeeProfileService } from '../services/EmployeeProfileService';

export interface IStewardSpotlightProps {
  title: string;
  subtitle: string;
  description: string;
  nominateUrl: string;
  readMoreUrl: string;
  /** Selection saved by the People Picker (at most one person). */
  featuredEmployee?: IPropertyFieldGroupOrPerson[];
  profileService: EmployeeProfileService;
}
