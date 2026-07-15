import { AffectedRecords, OptionsBase, OptionsWithRql, PagedResult } from '../../../types';

export interface OAuth2RefreshTokenService {
    /**
     * # Get a list of OAuth2 refresh tokens
     *
     * Permission | Scope | Effect
     * - | - | -
     * none | | Can only see a list of OAuth2 refresh tokens for this account
     * VIEW_OAUTH2_REFRESH_TOKENS or VIEW_AUTHORIZATIONS | global | Can see a list of OAuth2 refresh tokens for any account
     * Using VIEW_AUTHORIZATIONS for this endpoint is deprecated; use VIEW_OAUTH2_REFRESH_TOKENS instead
     * @param options.rql Add filters to the requested list
     * @returns PagedResult<OAuth2RefreshToken>
     */
    find(options?: OptionsWithRql): Promise<PagedResult<OAuth2RefreshToken>>;

    /**
     * Get a list of OAuth2 refresh tokens
     *
     * Permission | Scope | Effect
     * - | - | -
     * none | | Can only see a list of OAuth2 refresh tokens for this account
     * VIEW_OAUTH2_REFRESH_TOKENS or VIEW_AUTHORIZATIONS | global | Can see a list of OAuth2 refresh tokens for any account
     * Using VIEW_AUTHORIZATIONS for this endpoint is deprecated; use VIEW_OAUTH2_REFRESH_TOKENS instead
     * @param options.rql Add filters to the requested list
     * @returns OAuth2RefreshToken[]
     */
    findAll(options?: OptionsWithRql): Promise<OAuth2RefreshToken[]>;

    /**
     * Get the first OAuth2 refresh token found
     *
     * Permission | Scope | Effect
     * - | - | -
     * none | | Can only see a list of OAuth2 refresh tokens for this account
     * VIEW_OAUTH2_REFRESH_TOKENS or VIEW_AUTHORIZATIONS | global | Can see a list of OAuth2 refresh tokens for any account
     * Using VIEW_AUTHORIZATIONS for this endpoint is deprecated; use VIEW_OAUTH2_REFRESH_TOKENS instead
     * @param options.rql Add filters to the requested list
     * @returns {Promise<OAuth2RefreshToken | undefined>}
     */
    findFirst(options?: OptionsWithRql): Promise<OAuth2RefreshToken | undefined>;

    /**
     * Get an oAuth2 refresh token by its id
     *
     * Permission | Scope | Effect
     * - | - | -
     * none | | Can only see a list of OAuth2 refresh tokens for this account
     * VIEW_OAUTH2_REFRESH_TOKENS or VIEW_AUTHORIZATIONS | global | Can see a list of OAuth2 refresh tokens for any account
     * Using VIEW_AUTHORIZATIONS for this endpoint is deprecated; use VIEW_OAUTH2_REFRESH_TOKENS instead
     * @param id the refresh token id
     * @param options.rql Add filters to the requested list
     * @returns {Promise<OAuth2RefreshToken | undefined>}
     */
    findById(id: string, options?: OptionsWithRql): Promise<OAuth2RefreshToken | undefined>;

    /**
     * Delete an oAuth2 refresh token
     *
     * Permission | Scope | Effect
     * - | - | -
     * none | | Can only delete OAuth2 refresh tokens for this account
     * DELETE_OAUTH2_REFRESH_TOKEN or DELETE_AUTHORIZATIONS | global | Delete any OAuth2 refresh tokens belonging to any user
     * Using DELETE_AUTHORIZATIONS for this endpoint is deprecated; use DELETE_OAUTH2_REFRESH_TOKEN instead
     * @param id the refresh token id
     * @returns AffectedRecords
     */
    remove(id: string, options?: OptionsBase): Promise<AffectedRecords>;
}

export interface OAuth2RefreshToken {
    id: string;
    applicationId: string;
    userId: string;
    expiryTimestamp: Date;
    updateTimestamp: Date;
    creationTimestamp: Date;
}
