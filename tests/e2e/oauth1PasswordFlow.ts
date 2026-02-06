import { createClient } from '../../src';
import { NoPermissionError } from '../../src/errors';
import { rqlBuilder } from '../../src/rql';
import { newSchemaInput } from '../__helpers__/data';

describe('OAuth1 Password Flow', () => {
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

  // health service
  it('Fetches users.health', async () => {
    const res = await sdk.users.health();
    expect(res).toBe(true);
  });

  // users service
  it('Fetches users.me', async () => {
    const user = await sdk.users.me();
    expect(user.id).toBeDefined();
    expect(user.firstName).toBeDefined();
  });

  it('Fetches users.find', async () => {
    const res = await sdk.users.find();
    expect(res.data.length).toBeGreaterThan(0);
  });

  // group roles service
  it('Fetches users.groupRoles.getPermissions', async () => {
    const res = await sdk.users.groupRoles.getPermissions();
    expect(res.data.length).toBeGreaterThan(0);
  });

  // global roles service
  it('Fetches users.globalRoles.getPermissions', async () => {
    const res = await sdk.users.globalRoles.getPermissions();
    expect(res.data.length).toBeGreaterThan(0);
  });

  it('Fetches users.globalRoles.get', async () => {
    expect.assertions(1);
    const rql = rqlBuilder().limit(10).build();
    try {
      const res = await sdk.users.globalRoles.get({ rql });
      expect(res.data.length).toBeGreaterThan(0);
    } catch (err) {
      expect(err).toBeInstanceOf(NoPermissionError);
    }
  });

  // auth service
  it('Fetches auth.applications.get', async () => {
    const rql = rqlBuilder().select('name').build();
    const res = await sdk.auth.applications.get({ rql });
    expect(res).toBeDefined();
  });

  // files service
  it('Fetches files.find', async () => {
    expect.assertions(1);
    const rql = rqlBuilder().select('name').build();
    try {
      const res = await sdk.files.find({ rql });
      expect(res.data.length).toBeGreaterThan(0);
    } catch (err) {
      expect(err).toBeInstanceOf(NoPermissionError);
    }
  });

  // data infrastructure service
  it('Fetches data.health', async () => {
    const res = await sdk.data.health();
    expect(res).toBe(true);
  });

  // data schemas service
  it('Fetches data.schemas.create', async () => {
    try {
      const schema = await sdk.data.schemas.create(newSchemaInput);
      expect(schema.creationTransition).toBeDefined();
    } catch (err) {
      expect(err).toBeInstanceOf(NoPermissionError);
    }
  });

  // tasks service
  it('Fetches tasks.find', async () => {
    expect.assertions(1);
    try {
      const res = await sdk.tasks.find();
      expect(res.data.length).toBeGreaterThan(0);
    } catch (err) {
      expect(err).toBeInstanceOf(NoPermissionError);
    }
  });
});
