import { createClient, rqlBuilder } from '../../../src';
import { createProviderData, generateRandomName } from '../../__helpers__/oidc';
import { OidcProviderResponse } from '../../../src/models/oidc/Providers';

describe('Enables an OpenID Connect workflow', () => {
  let provider: OidcProviderResponse;

  const sdk = createClient({
    host: process.env.API_HOST,
    consumerKey: process.env.CONSUMER_KEY,
    consumerSecret: process.env.CONSUMER_SECRET,
  });

  beforeAll(async () => {
    await sdk.auth.authenticate({
      email: process.env.API_USERNAME,
      password: process.env.API_PASSWORD,
    });
  });

  beforeEach(async () => {
    const data = createProviderData();
    provider = await sdk.auth.oidc.createProvider(data);
  });

  afterAll(async () => {
    await sdk.auth.oidc.deleteProvider(provider.id);
  });

  it('Creates an OpenID Connect provider', async () => {
    const rql = rqlBuilder().eq('name', provider.name).build();
    const providers = await sdk.auth.oidc.getProviders({ rql });

    expect(providers.data.length).toBe(1);
    expect(providers.data[0]).toMatchObject({ ...provider });
  });

  it('Lists providers and accepts a RQL query', async () => {
    const rql = rqlBuilder().eq('name', provider.name).build();

    let providers = await sdk.auth.oidc.getProviders({ rql });
    expect(providers.data.length).toBe(1);

    providers = await sdk.auth.oidc.getProviders();
    expect(providers.data.length).toBeGreaterThan(0);
  });

  it('Updates an OpenID Connect provider', async () => {
    const updatedName = generateRandomName();
    await sdk.auth.oidc.updateProvider(provider.id, { name: updatedName });

    const rql = rqlBuilder().eq('name', updatedName).build();
    const providers = await sdk.auth.oidc.getProviders({ rql });

    expect(providers.data[0]).toMatchObject({ name: updatedName });
  });

  it('Deletes an OpenID Connect provider', async () => {
    await sdk.auth.oidc.disableProvider(provider.id);
    await sdk.auth.oidc.deleteProvider(provider.id);

    const rql = rqlBuilder().eq('name', provider.name).build();
    const providers = await sdk.auth.oidc.getProviders({ rql });

    expect(providers.data.length).toBe(0);
  });

  it('Enables an OpenID Connect provider', async () => {
    await sdk.auth.oidc.enableProvider(provider.id);

    const rql = rqlBuilder().eq('name', provider.name).build();
    const providers = await sdk.auth.oidc.getProviders({ rql });

    expect(providers.data[0]).toMatchObject({
      name: provider.name,
      enabled: true,
    });
  });

  it('Disables an OpenID Connect provider', async () => {
    await sdk.auth.oidc.disableProvider(provider.id);

    const rql = rqlBuilder().eq('name', provider.name).build();
    const providers = await sdk.auth.oidc.getProviders({ rql });

    expect(providers.data[0]).toMatchObject({
      name: provider.name,
      enabled: false,
    });
  });
});
