import { AffectedRecords, OptionsWithRql, PagedResult } from '../../../types';

export interface AuthOauth2TokenService {
    /**
     * Get a list of OAuth2 tokens
     *
     * Permission | Scope | Effect
     * - | - | -
     * none | | Can only see a list of OAuth2 tokens for this account
     * VIEW_AUTHORIZATIONS | global | See any OAuth2 tokens belonging to any user
     */
    find(options?: OptionsWithRql): Promise<PagedResult<OAuth2Token>>;

    /**
     * Get a list of OAuth2 tokens
     *
     * Permission | Scope | Effect
     * - | - | -
     * none | | Can only see a list of OAuth2 tokens for this account
     * VIEW_AUTHORIZATIONS | global | See any OAuth2 tokens belonging to any user
     */
    findAll(options?: OptionsWithRql): Promise<OAuth2Token[]>;

    /**
     * Get the first OAuth2 token found
     *
     * Permission | Scope | Effect
     * - | - | -
     * none | | Can only see a list of OAuth2 tokens for this account
     * VIEW_AUTHORIZATIONS | global | See any OAuth2 tokens belonging to any user
     */
    findFirst(options?: OptionsWithRql): Promise<OAuth2Token | undefined>;

    /**
     * Get an oAuth2 token by its id
     *
     * Permission | Scope | Effect
     * - | - | -
     * none | | Can only see a list of OAuth2 tokens for this account
     * VIEW_AUTHORIZATIONS | global | See any OAuth2 tokens belonging to any user
     */
    findById(id: string, options?: OptionsWithRql): Promise<OAuth2Token | undefined>;

    /**
     * Remove an oAuth2 token
     *
     * Permission | Scope | Effect
     * - | - | -
     * none | | Can only delete OAuth2 tokens for this account
     * DELETE_AUTHORIZATIONS | global | Delete any OAuth2 tokens belonging to any user
     */
    remove(id: string): Promise<AffectedRecords>;
}

export interface OAuth2Token {
    id: string;
    applicationId: string;
    userId: string;
    refreshTokenId: string;
    /**
     * @deprecated `accessToken` will be removed from responses returned by listing endpoints in a future version.
     */
    accessToken?: string;
    expiryTimestamp: Date;
    updateTimestamp: Date;
    creationTimestamp: Date;
}
