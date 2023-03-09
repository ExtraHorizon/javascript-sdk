export interface BaseOidcProvider {
  name: string; // Human friendly name of the provider, which can also be used in the oidc login urls
  description: string; // Description of the provider
  issuerId: string; // Required for us to validate the ID token jwt ("iss")
  clientId: string; // Provided by the provider after registration
  authorizationEndpoint: string; // Only used by our customer to redirect the user to
  tokenEndpoint: string; // Used by us to exchange the code to an ID token
  userinfoEndpoint: string; // Required to get get the name and email address of the user
  redirectUri: string; // Required we need to send this as well to the token endpoint
}

export interface OidcProvider extends OidcProviderCreation {
  id: string;
  creationTimestamp: Date;
  updateTimestamp: Date;
  enabled: boolean;
}

export interface OidcProviderCreation extends BaseOidcProvider {
  clientSecret: string; // Provided by the provider after registration
}

export interface OidcProviderResponse extends Partial<BaseOidcProvider> {
  id?: string;
  creationTimestamp?: Date;
  updateTimestamp?: Date;
  enabled?: boolean;
  clientSecretHint?: string;
}

export type OidcProviderUpdate = Partial<OidcProviderCreation>;
