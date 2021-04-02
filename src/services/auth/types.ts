import { listResponse } from '../../models';

interface OAuth1ApplicationVersion {
  id: string;
  name: string;
  consumerKey: string;
  consumerSecret: string;
  creationTimestamp: number;
}

interface OAuth1Application {
  id: string;
  name: string;
  description: string;
  type: string; // 'oauth2'
  versions: Array<OAuth1ApplicationVersion>;
  updateTimestamp: number;
  creationTimestamp: number;
}

interface OAuth2ApplicationVersion {
  id: string;
  name: string;
  clientId: string;
  clientSecret: string;
  creationTimestamp: number;
}

interface OAuth2Application {
  id: string;
  name: string;
  description: string;
  type: string; // 'oauth2'
  versions: Array<OAuth2ApplicationVersion>;
  logo: string;
  redirectUris: Array<string>;
  confidential: boolean;
  updateTimestamp: number;
  creationTimestamp: number;
}

export type ApplicationData = OAuth1Application | OAuth2Application;

export type OAuth1ApplicationCreationSchema = Pick<
  OAuth1Application,
  'type' | 'name' | 'description'
>;

export type OAuth2ApplicationCreationSchema = Pick<
  OAuth2Application,
  'type' | 'name' | 'description' | 'logo' | 'redirectUris' | 'confidential'
>;

export type ApplicationDataCreation =
  | OAuth1ApplicationCreationSchema
  | OAuth2ApplicationCreationSchema;

export type OAuth1ApplicationUpdateSchema = Pick<
  OAuth1Application,
  'type' | 'name' | 'description'
>;

export type OAuth2ApplicationUpdateSchema = Pick<
  OAuth2Application,
  'type' | 'name' | 'description' | 'logo' | 'redirectUris'
>;

export type ApplicationDataUpdate =
  | OAuth1ApplicationUpdateSchema
  | OAuth2ApplicationUpdateSchema;

export interface ApplicationDataList extends listResponse {
  data: ApplicationData[];
}
