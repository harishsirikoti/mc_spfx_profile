import * as React from 'react';
import type { IPropertyFieldGroupOrPerson } from '@pnp/spfx-property-controls/lib/PropertyFieldPeoplePicker';
import type { IEmployeeProfileProps } from './EmployeeProfile/IEmployeeProfileProps';
import type { EmployeeProfileService } from '../services/EmployeeProfileService';

export type EmployeeProfileStatus = 'empty' | 'loading' | 'ready' | 'error';

export interface IUseEmployeeProfileResult {
  status: EmployeeProfileStatus;
  /** Always has displayable values when status is not "empty". */
  profile: IEmployeeProfileProps;
}

const DEFAULT_JOB_TITLE: string = 'Employee';

interface IFetchResult {
  /** The account this result belongs to. Used to ignore results of a previous selection. */
  accountName: string;
  status: 'ready' | 'error';
  profile?: IEmployeeProfileProps;
}

/** The sign-in address is the last part of a login claim: "i:0#.f|membership|user@contoso.com". */
function getSignInName(employee: IPropertyFieldGroupOrPerson): string {
  const fromClaim: string = (employee.id || '').split('|').pop() || '';
  return employee.email || fromClaim || employee.login;
}

/**
 * Loads the profile of the selected employee.
 * - Fetches only when the selected account changes, not on every web part re-render.
 * - Results of an older selection are ignored, so the card never shows the wrong person.
 * - While loading or after an error, the name and job title saved by the People Picker are shown.
 */
export function useEmployeeProfile(
  service: EmployeeProfileService,
  employee: IPropertyFieldGroupOrPerson | undefined
): IUseEmployeeProfileResult {
  const accountName: string | undefined = employee?.id;
  const [result, setResult] = React.useState<IFetchResult | undefined>(undefined);

  React.useEffect(() => {
    if (!employee || !accountName) {
      return undefined;
    }

    let isCurrent: boolean = true;
    service
      .getProfile(accountName, getSignInName(employee))
      .then((profile: IEmployeeProfileProps) => {
        if (isCurrent) {
          setResult({ accountName, status: 'ready', profile });
        }
      })
      .catch(() => {
        // Unavailable profile or missing permission: fall back to the saved selection data.
        if (isCurrent) {
          setResult({ accountName, status: 'error' });
        }
      });

    // Runs when the selection changes or the web part is removed.
    return () => {
      isCurrent = false;
    };
    // Only the account id decides when to fetch; the other employee fields are read inside.
  }, [service, accountName]);

  if (!employee || !accountName) {
    return { status: 'empty', profile: { displayName: '', jobTitle: '' } };
  }

  // Data saved with the selection, used until (or instead of) the live profile.
  const saved: IEmployeeProfileProps = {
    displayName: employee.fullName,
    jobTitle: employee.jobTitle || DEFAULT_JOB_TITLE
  };

  // A result for a different account is stale, so treat it as "still loading".
  if (!result || result.accountName !== accountName) {
    return { status: 'loading', profile: saved };
  }

  if (result.status === 'error' || !result.profile) {
    return { status: 'error', profile: saved };
  }

  return {
    status: 'ready',
    profile: {
      displayName: result.profile.displayName || saved.displayName,
      jobTitle: result.profile.jobTitle || DEFAULT_JOB_TITLE,
      photoUrl: result.profile.photoUrl
    }
  };
}
