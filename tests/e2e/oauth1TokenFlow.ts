import { client } from '../../src';
import { rqlBuilder } from '../../src/rql';
import { NoPermissionError } from '../../src/errors';
import { newSchemaInput } from '../__helpers__/data';

describe('OAuth1 Token Flow', () => {
  let sdk;

  beforeAll(async () => {
    sdk = client({
      apiHost: process.env.API_HOST,
      consumerKey: process.env.CONSUMER_KEY,
      consumerSecret: process.env.CONSUMER_SECRET,
    });
    await sdk.auth.authenticate({
      token: process.env.TOKEN,
      tokenSecret: process.env.TOKEN_SECRET,
    });
  });

  // health service
  it('Can call the users.health', async () => {
    const res = await sdk.users.health();
    expect(res).toBe(true);
  });

  // users service
  it('Can call users.me', async () => {
    const user = await sdk.users.me();
    expect(user.id).toBeDefined();
    console.log(user);
    expect(user.firstName).toBeDefined();
  });

  it('Can call users.find', async () => {
    const res = await sdk.users.find();
    expect(res.data.length).toBeGreaterThan(0);
  });

  // group roles service
  it('Can call users.getGroupsPermissions', async () => {
    const res = await sdk.users.getGroupsPermissions();
    expect(res.data.length).toBeGreaterThan(0);
  });

  // global roles service
  it('Can call users.getPermissions', async () => {
    const res = await sdk.users.getPermissions();
    expect(res.data.length).toBeGreaterThan(0);
  });

  it('Can call users.getRoles', async () => {
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
  it('Can call auth.getApplications', async () => {
    const rql = rqlBuilder().select('name').build();
    const res = await sdk.auth.getApplications(rql);
    expect(res).toBeDefined();
  });

  // files service
  it('Can call files.find', async () => {
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
  it('Can call data.health', async () => {
    const res = await sdk.data.health();
    expect(res).toBe(true);
  });

  // data schemas service
  it('Can call data.createSchema', async () => {
    try {
      const schema = await sdk.data.createSchema(newSchemaInput);
      expect(schema.creationTransition).toBeDefined();
    } catch (err) {
      expect(err).toBeInstanceOf(NoPermissionError);
    }
  });

  // tasks service
  it('Can call tasks.find', async () => {
    expect.assertions(1);
    try {
      const res = await sdk.tasks.find();
      expect(res.data.length).toBeGreaterThan(0);
    } catch (err) {
      expect(err).toBeInstanceOf(NoPermissionError);
    }
  });
});
