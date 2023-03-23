export interface BaseOidcProvider {
  /** Human friendly name of the provider, which can also be used in the oidc login urls */
  name: string;
  /** Description of the provider */
  description: string;
  /**  Required for us to validate the ID token jwt ("iss") */
  issuerId: string;
  /** Provided by the provider after registration */
  clientId: string;
  /** Only used by our customer to redirect the user to */
  authorizationEndpoint: string;
  /** Used by us to exchange the code to an ID token */
  tokenEndpoint: string;
  /** Required to get the name and email address of the user */
  userinfoEndpoint: string;
  /** Required we need to send this as well to the token endpoint */
  redirectUri: string;
}

export interface OidcProvider extends OidcProviderCreation {
  id: string;
  creationTimestamp: Date;
  updateTimestamp: Date;
  enabled: boolean;
}

export interface OidcProviderCreation extends BaseOidcProvider {
  /** Provided by the provider after registration */
  clientSecret: string;
}

export interface OidcProviderResponse extends Partial<BaseOidcProvider> {
  id?: string;
  creationTimestamp?: Date;
  updateTimestamp?: Date;
  enabled?: boolean;
  clientSecretHint?: string;
}

export type OidcProviderUpdate = Partial<OidcProviderCreation>;

export interface OidcLinkRequestBody {
  /** Obtained from the OpenID Connect provider upon successful user login. */
  authorizationCode: string;
  /** Optional: include the nonce if it was provided in the authentication request */
  nonce?: string;
}
