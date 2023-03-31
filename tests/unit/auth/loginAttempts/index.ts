// eslint-disable-next-line import/no-extraneous-dependencies
import nock from 'nock';
import { data } from './data.json';
import { AUTH_BASE } from '../../../../src/constants';
import { createClient } from '../../../../src/index';
import { createPagedResponse } from '../../../__helpers__/utils';
import { rqlBuilder } from '../../../../src/rql';

describe('Auth - OpenID Connect - Login Attempts', () => {
  const host = 'https://api.xxx.extrahorizon.com';

  const sdk = createClient({
    host,
    clientId: '',
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('should allow querying login attempts with rql', async () => {
    const rql = rqlBuilder()
      .eq('providerSubjectId', '101009890263471329416')
      .build();

    nock(`${host}${AUTH_BASE}`)
      .get(`/oidc/loginAttempts${rql}`)
      .reply(200, createPagedResponse(data));

    const loginAttemptsPager = await sdk.auth.oidc.loginAttempts.find({ rql });
    expect(loginAttemptsPager.data.length).toEqual(data.length);
  });

  it('should allow login attempts results to be iterated with a pager', async () => {
    const firstPageRql = rqlBuilder().limit(5).build();
    const secondPageRql = rqlBuilder().limit(5, 5).build();

    const firstPageData = data.slice(0, 5);
    const firstPageIds = firstPageData.map(({ id }) => id);

    const secondPageData = data.slice(5, 10);
    const secondPageIds = secondPageData.map(({ id }) => id);

    nock(`${host}${AUTH_BASE}`)
      .get(`/oidc/loginAttempts${firstPageRql}`)
      .reply(200, createPagedResponse(firstPageData, { limit: 5 }));

    const firstPageResult = await sdk.auth.oidc.loginAttempts.find({
      rql: firstPageRql,
    });
    const firstPageResultIds = firstPageResult.data.map(({ id }) => id);
    expect(firstPageResultIds).toEqual(firstPageIds);

    nock(`${host}${AUTH_BASE}`)
      .get(`/oidc/loginAttempts${secondPageRql}`)
      .reply(200, createPagedResponse(secondPageData, { limit: 5, offset: 5 }));

    const secondPageResult = await firstPageResult.next();
    const secondPageResultIds = secondPageResult.data.map(({ id }) => id);
    expect(secondPageResultIds).toEqual(secondPageIds);

    nock(`${host}${AUTH_BASE}`)
      .get(`/oidc/loginAttempts${firstPageRql}`)
      .reply(200, createPagedResponse(firstPageData));

    const previousPageResult = await secondPageResult.previous();
    const previousPageIds = previousPageResult.data.map(({ id }) => id);
    expect(previousPageIds).toEqual(firstPageIds);
  });

  it('should allow querying all login attempts', async () => {
    // Limit is restricted to 50
    const rql = rqlBuilder().limit(50).build();

    nock(`${host}${AUTH_BASE}`)
      .get(`/oidc/loginAttempts${rql}`)
      .reply(200, createPagedResponse(data));

    const loginAttempts = await sdk.auth.oidc.loginAttempts.findAll();
    expect(loginAttempts.length).toEqual(data.length);
  });

  it('should find the first login attempt', async () => {
    nock(`${host}${AUTH_BASE}`)
      .get('/oidc/loginAttempts')
      .reply(200, createPagedResponse(data));

    const loginAttempt = await sdk.auth.oidc.loginAttempts.findFirst();
    expect(loginAttempt).toEqual({
      ...data[0],
      updateTimestamp: new Date(data[0].updateTimestamp),
      creationTimestamp: new Date(data[0].creationTimestamp),
    });
  });

  it('throws an error if a limit is provided to the findAll method', async () => {
    // Limit is restricted to 50
    const rql = rqlBuilder().limit(50).build();

    nock(`${host}${AUTH_BASE}`)
      .get(`/oidc/loginAttempts${rql}`)
      .reply(200, createPagedResponse(data));

    const findAllError = await sdk.auth.oidc.loginAttempts
      .findAll({ rql })
      .catch(error => error);
    expect(findAllError).toEqual(
      Error('Do not pass in limit operator with findAll')
    );
  });
});
