// eslint-disable-next-line import/no-extraneous-dependencies
import nock from 'nock';
import { createClient, rqlBuilder } from '../../../src';
import { AUTH_BASE } from '../../../src/constants';

describe('Auth - OpenID Connect', () => {
  const host = 'https://api.xxx.extrahorizon.com';

  const sdk = createClient({
    host,
    clientId: '',
  });

  const providerResponse = {
    id: '507f191e810c19729de860ea',
    name: 'google',
    description: "Google's Authorization Server",
    clientId: '1234567890asdfgh.apps.googleusercontent.com',
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    redirectUri: 'https://example.com/auth',
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
    userinfoEndpoint: 'https://openidconnect.googleapis.com/v1/userinfo',
    issuerId: 'https://accounts.google.com',
    clientSecretHint: 'YF3X',
    creationTimestamp: '2023-03-13T13:58:38.432Z',
    updateTimestamp: '2023-03-13T13:58:38.432Z',
  };

  const provider = {
    ...providerResponse,
    creationTimestamp: expect.any(Date),
    updateTimestamp: expect.any(Date),
  };

  it('Creates an OpenID Connect provider', async () => {
    const data = {
      name: 'google',
      description: "Google's Authorization Server",
      clientId: '1234567890asdfgh.apps.googleusercontent.com',
      clientSecret: 'mAwce6Kaz5YF3X',
      authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
      redirectUri: 'https://example.com/auth',
      tokenEndpoint: 'https://oauth2.googleapis.com/token',
      userinfoEndpoint: 'https://openidconnect.googleapis.com/v1/userinfo',
      issuerId: 'https://accounts.google.com',
    };

    nock(`${host}${AUTH_BASE}`)
      .post(`/oidc/providers`, data)
      .reply(200, providerResponse);

    const result = await sdk.auth.oidc.createProvider(data);
    expect(result).toMatchObject(provider);
  });

  it('Lists providers and accepts a RQL query', async () => {
    const rql = rqlBuilder().eq('name', 'google').build();

    nock(`${host}${AUTH_BASE}`)
      .get(`/oidc/providers?eq(name,google)`)
      .reply(200, {
        data: [providerResponse, providerResponse, providerResponse],
      });

    const { data } = await sdk.auth.oidc.getProviders({ rql });
    expect(data).toMatchObject([provider, provider, provider]);
  });

  it('Updates an OpenID Connect provider', async () => {
    nock(`${host}${AUTH_BASE}`)
      .put(`/oidc/providers/${provider.id}`, { name: 'google-v2' })
      .reply(200, { affectedRecords: 1 });

    const result = await sdk.auth.oidc.updateProvider(provider.id, {
      name: 'google-v2',
    });
    expect(result).toMatchObject({ affectedRecords: 1 });
  });

  it('Deletes an OpenID Connect provider', async () => {
    nock(`${host}${AUTH_BASE}`)
      .delete(`/oidc/providers/${provider.id}`)
      .reply(200, { affectedRecords: 1 });

    const result = await sdk.auth.oidc.deleteProvider(provider.id);
    expect(result).toMatchObject({ affectedRecords: 1 });
  });

  it('Enables an OpenID Connect provider', async () => {
    nock(`${host}${AUTH_BASE}`)
      .post(`/oidc/providers/${provider.id}/enable`)
      .reply(200, { affectedRecords: 1 });

    const result = await sdk.auth.oidc.enableProvider(provider.id);
    expect(result).toMatchObject({ affectedRecords: 1 });
  });

  it('Disables an OpenID Connect provider', async () => {
    nock(`${host}${AUTH_BASE}`)
      .post(`/oidc/providers/${provider.id}/disable`)
      .reply(200, { affectedRecords: 1 });

    const result = await sdk.auth.oidc.disableProvider(provider.id);
    expect(result).toMatchObject({ affectedRecords: 1 });
  });
});