import { client } from '../../src';
import { rqlBuilder } from '../../src/rql';
import { NoPermissionError } from '../../src/errors';
import { newSchemaInput } from '../__helpers__/data';

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
  it('users.health()', async () => {
    const res = await sdk.users.health();
    expect(res).toBe(true);
  });

  // users service
  it('users.me()', async () => {
    const user = await sdk.users.me();
    expect(user.id).toBeDefined();
    expect(user.firstName).toBeDefined();
  });

  it('users.find()', async () => {
    const res = await sdk.users.find();
    expect(res.data.length).toBeGreaterThan(0);
  });

  // group roles service
  it('users.getGroupsPermissions()', async () => {
    const res = await sdk.users.getGroupsPermissions();
    expect(res.data.length).toBeGreaterThan(0);
  });

  // global roles service
  it('users.getPermissions()', async () => {
    const res = await sdk.users.getPermissions();
    expect(res.data.length).toBeGreaterThan(0);
  });

  it('users.getRoles()', async () => {
    expect.assertions(1);
    const rql = rqlBuilder().limit(10).build();
    try {
      const res = await sdk.users.getRoles(rql);
      expect(res.data.length).toBeGreaterThan(0);
    } catch (err) {
      expect(err).toBeInstanceOf(NoPermissionError);
    }
  });

  // auth service
  it('auth.getApplications()', async () => {
    const rql = rqlBuilder().select('name').build();
    const res = await sdk.auth.getApplications(rql);
    expect(res).toBeDefined();
  });

  // files service
  it('files.find()', async () => {
    expect.assertions(1);
    const rql = rqlBuilder().select('name').build();
    try {
      const res = await sdk.files.find(rql);
      expect(res.data.length).toBeGreaterThan(0);
    } catch (err) {
      expect(err).toBeInstanceOf(NoPermissionError);
    }
  });

  // data infrastructure service
  it('data.health()', async () => {
    const res = await sdk.data.health();
    expect(res).toBe(true);
  });

  // data schemas service
  it('data.createSchema()', async () => {
    try {
      const schema = await sdk.data.createSchema(newSchemaInput);
      expect(schema.creationTransition).toBeDefined();
    } catch (err) {
      expect(err).toBeInstanceOf(NoPermissionError);
    }
  });

  // tasks service
  it('tasks.find()', async () => {
    const res = await sdk.tasks.find();
    expect(res.data.length).toBeGreaterThan(0);
  });
});
