import { AffectedRecords, OptionsBase, OptionsWithRql, PagedResult } from '../../../types';
import { OAuth2Authorization, OAuth2AuthorizationCreation, OAuth2AuthorizationCreationResponse } from '../types';

export interface OAuth2AuthorizationsService {
    /**
     * Create an OAuth2 authorization
     *
     * Permission | Scope | Effect
     * - | - | -
     * none | | Everyone can use this endpoint
     */
    create(data: OAuth2AuthorizationCreation, options?: OptionsBase): Promise<OAuth2AuthorizationCreationResponse>;

    /**
     * Get a list of OAuth2 authorizations
     *
     * Permission | Scope | Effect
     * - | - | -
     * none | | Can only see a list of OAuth2 authorizations for this account
     * VIEW_AUTHORIZATIONS | global | See any authorizations belonging to any user
     * @param options.rql Add filters to the requested list
     * @returns PagedResult<OAuth2Authorization>
     */
    find(options?: OptionsWithRql): Promise<PagedResult<OAuth2Authorization>>;

    /**
     * Get a list of OAuth2 authorizations
     *
     * Permission | Scope | Effect
     * - | - | -
     * none | | Can only see a list of OAuth2 authorizations for this account
     * VIEW_AUTHORIZATIONS | global | See any authorizations belonging to any user
     * @param options.rql Add filters to the requested list
     * @returns OAuth2Authorization[]
     */
    findAll(options?: OptionsWithRql): Promise<OAuth2Authorization[]>;

    /**
     * Get the first OAuth2 authorization found
     *
     * Permission | Scope | Effect
     * - | - | -
     * none | | Can only see a list of OAuth2 authorizations for this account
     * VIEW_AUTHORIZATIONS | global | See any authorizations belonging to any user
     * @param options.rql Add filters to the requested list
     * @returns {Promise<OAuth2Authorization | undefined>}
     */
    findFirst(options?: OptionsWithRql): Promise<OAuth2Authorization | undefined>;

    /**
     * Get an OAuth2 authorization by its id
     *
     * Permission | Scope | Effect
     * - | - | -
     * none | | Can only see a list of OAuth2 authorizations for this account
     * VIEW_AUTHORIZATIONS | global | See any authorizations belonging to any user
     * @param authorizationId the authorization id
     * @param options.rql Add filters to the requested list
     * @returns {Promise<OAuth2Authorization | undefined>}
     */
    findById(authorizationId: string, options?: OptionsWithRql): Promise<OAuth2Authorization | undefined>;

    /**
     * Delete an OAuth2 authorization
     *
     * Permission | Scope | Effect
     * - | - | -
     * none | | Can only delete OAuth2 authorizations for this account
     * DELETE_AUTHORIZATIONS | global | Delete any authorizations belonging to any user
     * @param authorizationId the Authorization id
     */
    remove(authorizationId: string, options?: OptionsBase): Promise<AffectedRecords>;
}
