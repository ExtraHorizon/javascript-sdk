import nock from 'nock';
import { AUTH_BASE, DATA_BASE } from '../../../src/constants';
import { Client, client } from '../../../src/index';
import {
  newSchemaInput,
  newSchemaCreated,
  schemasListResponse,
} from '../../__helpers__/data';

describe('Schemas Service', () => {
  const schemaId = newSchemaCreated.id;
  const apiHost = 'https://api.xxx.fibricheck.com';
  let sdk: Client;

  beforeAll(async () => {
    sdk = client({
      apiHost,
    });

    const mockToken = 'mockToken';
    nock(apiHost)
      .post(`${AUTH_BASE}/oauth2/token`)
      .reply(200, { access_token: mockToken });

    await sdk.authenticate({
      clientId: '',
      username: '',
      password: '',
    });
  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it('Create a schema', async () => {
    nock(`${apiHost}${DATA_BASE}`).post('/').reply(200, newSchemaCreated);
    const schema = await sdk.data.createSchema(newSchemaInput);
    expect(schema.creationTransition).toBeDefined();
  });

  it('Request a list of schemas', async () => {
    nock(`${apiHost}${DATA_BASE}`).get('/').reply(200, schemasListResponse);
    const res = await sdk.data.find();
    expect(res.data.length).toBeGreaterThan(0);
  });

  it('Update a schema', async () => {
    const newSchemaData = { name: 'schemaA', description: 'schema desc' };
    nock(`${apiHost}${DATA_BASE}`).put(`/${schemaId}`).reply(200, {
      affectedRecords: 1,
    });
    const res = await sdk.data.updateSchema(schemaId, newSchemaData);
    expect(res.affectedRecords).toBe(1);
  });

  it('Delete a schema', async () => {
    nock(`${apiHost}${DATA_BASE}`).delete(`/${schemaId}`).reply(200, {
      affectedRecords: 1,
    });
    const res = await sdk.data.deleteSchema(schemaId);
    expect(res.affectedRecords).toBe(1);
  });

  it('Disable a schema', async () => {
    nock(`${apiHost}${DATA_BASE}`).post(`/${schemaId}/disable`).reply(200, {
      affectedRecords: 1,
    });
    const res = await sdk.data.disableSchema(schemaId);
    expect(res.affectedRecords).toBe(1);
  });

  it('Enable a schema', async () => {
    nock(`${apiHost}${DATA_BASE}`).post(`/${schemaId}/enable`).reply(200, {
      affectedRecords: 1,
    });
    const res = await sdk.data.enableSchema(schemaId);
    expect(res.affectedRecords).toBe(1);
  });
});
