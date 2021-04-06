import { listResponse } from '../../models';

interface Timestamp {
  updateTimestamp: number;
  creationTimestamp: number;
}
interface OAuth1ApplicationVersion {
  id: string;
  name: string;
  consumerKey: string;
  consumerSecret: string;
  creationTimestamp: number;
}

interface OAuth1Application extends Timestamp {
  id: string;
  name: string;
  description: string;
  type: string; // 'oauth2'
  versions: Array<OAuth1ApplicationVersion>;
}

interface OAuth2ApplicationVersion {
  id: string;
  name: string;
  clientId: string;
  clientSecret: string;
  creationTimestamp: number;
}

interface OAuth2Application extends Timestamp {
  id: string;
  name: string;
  description: string;
  type: string; // 'oauth2'
  versions: Array<OAuth2ApplicationVersion>;
  logo: string;
  redirectUris: Array<string>;
  confidential: boolean;
}

export type Application = OAuth1Application | OAuth2Application;

export type OAuth1ApplicationCreationSchema = Pick<
  OAuth1Application,
  'type' | 'name' | 'description'
>;

export type OAuth2ApplicationCreationSchema = Pick<
  OAuth2Application,
  'type' | 'name' | 'description' | 'logo' | 'redirectUris' | 'confidential'
>;

export type ApplicationCreation =
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

export type ApplicationUpdate =
  | OAuth1ApplicationUpdateSchema
  | OAuth2ApplicationUpdateSchema;

export interface ApplicationList extends listResponse {
  data: Application[];
}

export interface ApplicationVersionCreation {
  name: string;
}

export type ApplicationVersion =
  | OAuth1ApplicationVersion
  | OAuth2ApplicationVersion;

export interface OAuth2AuthorizationCreation {
  responseType: string;
  clientId: string;
  redirectUri: string;
  state: string;
  scope: string;
}

export interface OAuth2Authorization extends Timestamp {
  id: string;
  userId: string;
  clientId: string;
  authorizationCode: string;
  state: string;
}
export interface OAuth2AuthorizationList extends listResponse {
  data: OAuth2Authorization[];
}
