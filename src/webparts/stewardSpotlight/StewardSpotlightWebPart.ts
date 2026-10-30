import * as React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import {
  PropertyFieldPeoplePicker,
  PrincipalType,
  type IPropertyFieldGroupOrPerson,
  type IPropertyFieldPeoplePickerProps
} from '@pnp/spfx-property-controls/lib/PropertyFieldPeoplePicker';

import * as strings from 'StewardSpotlightWebPartStrings';
import StewardSpotlight from './components/StewardSpotlight';
import { IStewardSpotlightProps } from './components/IStewardSpotlightProps';
import { validateUrlField } from './utils/urlValidation';
import { EmployeeProfileService } from './services/EmployeeProfileService';

export interface IStewardSpotlightWebPartProps {
  title: string;
  subtitle: string;
  description: string;
  nominateUrl: string;
  readMoreUrl: string;
  /**
   * The employee chosen in the People Picker, saved with the page.
   * It holds one item (or none): login claim (id), name, email, job title.
   */
  featuredEmployee: IPropertyFieldGroupOrPerson[];
}

export default class StewardSpotlightWebPart extends BaseClientSideWebPart<IStewardSpotlightWebPartProps> {

  private _root: Root | undefined;
  private _profileService!: EmployeeProfileService;

  protected onInit(): Promise<void> {
    // One service instance for the whole web part life time.
    this._profileService = new EmployeeProfileService(
      this.context.spHttpClient,
      this.context.pageContext.web.absoluteUrl
    );
    return Promise.resolve();
  }

  public render(): void {
    const element: React.ReactElement<IStewardSpotlightProps> = React.createElement(
      StewardSpotlight,
      {
        title: this.properties.title,
        subtitle: this.properties.subtitle,
        description: this.properties.description,
        nominateUrl: this.properties.nominateUrl,
        readMoreUrl: this.properties.readMoreUrl,
        featuredEmployee: this.properties.featuredEmployee,
        profileService: this._profileService
      }
    );
    //root
    if (!this._root) {
      this._root = createRoot(this.domElement);
    }

    this._root.render(element);
  }

  protected onDispose(): void {
    this._root?.unmount();
    this._root = undefined;
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  // Validation message shown in the property pane when a link is not a safe URL.
  private _validateUrl = (value: string): string => validateUrlField(value, strings.InvalidUrlMessage);

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.ContentGroupName,
              groupFields: [
                PropertyPaneTextField('title', {
                  label: strings.TitleFieldLabel
                }),
                PropertyPaneTextField('subtitle', {
                  label: strings.SubtitleFieldLabel
                }),
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel,
                  multiline: true,
                  rows: 6,
                  resizable: true
                })
              ]
            },
            {
              groupName: strings.FeaturedEmployeeGroupName,
              groupFields: [
                PropertyFieldPeoplePicker('featuredEmployee', {
                  label: strings.FeaturedEmployeeFieldLabel,
                  // PnP ships its own copy of the SPFx types, so the same context needs a type cast here.
                  context: this.context as unknown as IPropertyFieldPeoplePickerProps['context'],
                  // Restores the saved selection when the property pane is opened again.
                  initialData: this.properties.featuredEmployee,
                  // Only one person, and only real users (no SharePoint or security groups).
                  multiSelect: false,
                  allowDuplicate: false,
                  principalType: [PrincipalType.Users],
                  searchTextLimit: 2,
                  // Saves the selection (or an empty list when cleared) into the web part properties.
                  properties: this.properties,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  deferredValidationTime: 0,
                  key: 'featuredEmployeePicker'
                })
              ]
            },
            {
              groupName: strings.LinksGroupName,
              groupFields: [
                PropertyPaneTextField('nominateUrl', {
                  label: strings.NominateUrlFieldLabel,
                  description: strings.UrlFieldDescription,
                  onGetErrorMessage: this._validateUrl
                }),
                PropertyPaneTextField('readMoreUrl', {
                  label: strings.ReadMoreUrlFieldLabel,
                  description: strings.UrlFieldDescription,
                  onGetErrorMessage: this._validateUrl
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
