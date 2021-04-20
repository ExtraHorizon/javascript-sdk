import { client } from '../../src';
import rqlBuilder from '../../src/rql';

describe('OAuth2 Password Flow', () => {
  let sdk;

  beforeAll(async () => {
    sdk = client({
      apiHost: process.env.API_HOST,
    });
    await sdk.authenticate({
      username: process.env.API_USERNAME,
      password: process.env.API_PASSWORD,
    });
  });

  // health service
  it('health()', async () => {
    const res = await sdk.users.health();
    expect(res).toBe(true);
  });

  // users service
  it('me()', async () => {
    const user = await sdk.users.me();
    expect(user.id).toBeDefined();
    expect(user.firstName).toBeDefined();
  });

  it('find()', async () => {
    const res = await sdk.users.find();
    expect(res.data.length).toBeGreaterThan(0);
  });

  // group roles service
  it('getGroupsPermissions()', async () => {
    const res = await sdk.users.getGroupsPermissions();
    expect(res.data.length).toBeGreaterThan(0);
  });

  // global roles service
  it('getPermissions()', async () => {
    const res = await sdk.users.getPermissions();
    expect(res.data.length).toBeGreaterThan(0);
  });

  it('getRoles()', async () => {
    const rql = rqlBuilder().limit(10).build();
    const res = await sdk.users.getRoles(rql);
    expect(res.data.length).toBeGreaterThan(0);
  });

  // auth service
  it('getApplications()', async () => {
    const rql = rqlBuilder().select('name').build();
    const res = await sdk.auth.getApplications(rql);
    expect(res).toBeDefined();
  });

  // files service
  it('find()', async () => {
    const rql = rqlBuilder().select('name').build();
    const res = await sdk.files.find(rql);
    expect(res.data.length).toBeGreaterThan(0);
  });
});
