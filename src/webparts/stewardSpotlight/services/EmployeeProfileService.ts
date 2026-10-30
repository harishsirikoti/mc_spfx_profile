import { SPHttpClient, type SPHttpClientResponse } from '@microsoft/sp-http';
import type { IEmployeeProfileProps } from '../components/EmployeeProfile/IEmployeeProfileProps';

/** Raw fields we read from the SharePoint user profile service. */
interface IPeopleManagerResponse {
  DisplayName?: string;
  Title?: string;
  /** Empty (null in the JSON) when the user has no photo. */
  PictureUrl?: string;
}

/**
 * Reads an employee's profile from the SharePoint user profile service (PeopleManager).
 *
 * Why not Microsoft Graph: this API returns display name, job title and photo for any
 * signed-in user. It needs no extra API permissions, so no admin consent is required.
 */
export class EmployeeProfileService {
  constructor(
    private readonly _spHttpClient: SPHttpClient,
    private readonly _webUrl: string
  ) { }

  /**
   * @param accountName The user's SharePoint login claim, e.g. "i:0#.f|membership|user@contoso.com".
   *                    This is unique per user, so two people with the same name are never mixed up.
   * @param photoAccount The user's sign-in address, used to build the photo URL.
   */
  public async getProfile(accountName: string, photoAccount: string): Promise<IEmployeeProfileProps> {
    // OData string values are wrapped in single quotes, so a quote inside the value must be doubled.
    const encodedAccount: string = encodeURIComponent(accountName.replace(/'/g, "''"));
    const url: string =
      `${this._webUrl}/_api/SP.UserProfiles.PeopleManager/GetPropertiesFor(accountName=@v)` +
      `?@v='${encodedAccount}'&$select=DisplayName,Title,PictureUrl`;

    const response: SPHttpClientResponse = await this._spHttpClient.get(url, SPHttpClient.configurations.v1);
    if (!response.ok) {
      // Only the status code is reported; no profile data is included in the error.
      throw new Error(`Profile request failed with status ${response.status}`);
    }

    const data: IPeopleManagerResponse = await response.json();

    return {
      displayName: data.DisplayName || '',
      jobTitle: data.Title || '',
      // A missing PictureUrl means the user has no photo, so the UI shows initials instead.
      photoUrl: data.PictureUrl ? this._getPhotoUrl(photoAccount) : undefined
    };
  }

  /** Photo URL served by the current site, so the browser uses the user's existing sign-in. */
  private _getPhotoUrl(photoAccount: string): string {
    return `${this._webUrl}/_layouts/15/userphoto.aspx?size=L&accountname=${encodeURIComponent(photoAccount)}`;
  }
}
