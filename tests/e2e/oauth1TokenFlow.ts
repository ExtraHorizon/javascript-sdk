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
  it('should fetch users.health', async () => {
    const res = await sdk.users.health();
    expect(res).toBe(true);
  });

  // users service
  it('should fetch users.me', async () => {
    const user = await sdk.users.me();
    expect(user.id).toBeDefined();
    console.log(user);
    expect(user.firstName).toBeDefined();
  });

  it('should fetch users.find', async () => {
    const res = await sdk.users.find();
    expect(res.data.length).toBeGreaterThan(0);
  });
  // group roles service
  it('should fetch users.groupRoles.getPermissions', async () => {
    const res = await sdk.users.groupRoles.getPermissions();
    expect(res.data.length).toBeGreaterThan(0);
  });

  // global roles service
  it('should fetch users.globalRoles.getPermissions', async () => {
    const res = await sdk.users.globalRoles.getPermissions();
    expect(res.data.length).toBeGreaterThan(0);
  });

  it('should fetch users.globalRoles.get', async () => {
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
  it('should fetch auth.applications.get', async () => {
    const rql = rqlBuilder().select('name').build();
    const res = await sdk.auth.applications.get({ rql });
    expect(res).toBeDefined();
  });

  // files service
  it('should fetch files.find', async () => {
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
  it('should fetch data.health', async () => {
    const res = await sdk.data.health();
    expect(res).toBe(true);
  });

  // data schemas service
  it('should fetch data.schemas.create', async () => {
    try {
      const schema = await sdk.data.schemas.create(newSchemaInput);
      expect(schema.creationTransition).toBeDefined();
    } catch (err) {
      expect(err).toBeInstanceOf(NoPermissionError);
    }
  });

  // tasks service
  it('should fetch tasks.find', async () => {
    expect.assertions(1);
    try {
      const res = await sdk.tasks.find();
      expect(res.data.length).toBeGreaterThan(0);
    } catch (err) {
      expect(err).toBeInstanceOf(NoPermissionError);
    }
  });
});
