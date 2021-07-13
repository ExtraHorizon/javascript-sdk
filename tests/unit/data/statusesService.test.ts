import nock from 'nock';
import { AUTH_BASE, DATA_BASE } from '../../../src/constants';
import { Client, createClient, ParamsOauth2 } from '../../../src/index';
import { newSchemaCreated } from '../../__helpers__/data';

describe('Statuses Service', () => {
  const schemaId = newSchemaCreated.id;
  const statusName = 'pending';
  const host = 'https://api.xxx.fibricheck.com';
  let sdk: Client<ParamsOauth2>;

  beforeAll(async () => {
    sdk = createClient({
      host,
      clientId: '',
    });

    const mockToken = 'mockToken';
    nock(host)
      .post(`${AUTH_BASE}/oauth2/tokens`)
      .reply(200, { access_token: mockToken });

    await sdk.auth.authenticate({
      username: '',
      password: '',
    });
  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it('should create a status', async () => {
    nock(`${host}${DATA_BASE}`)
      .post(`/${schemaId}/statuses`)
      .reply(200, { affectedRecords: 1 });
    const res = await sdk.data.statuses.create(schemaId, { name: statusName });
    expect(res.affectedRecords).toBe(1);
  });

  it('should update a status', async () => {
    nock(`${host}${DATA_BASE}`)
      .put(`/${schemaId}/statuses/${statusName}`)
      .reply(200, {
        affectedRecords: 1,
      });
    const res = await sdk.data.statuses.update(schemaId, statusName, {
      additionalProp1: 'string',
      additionalProp2: 'string',
      additionalProp3: 'string',
    });
    expect(res.affectedRecords).toBe(1);
  });

  it('should delete a status', async () => {
    nock(`${host}${DATA_BASE}`)
      .delete(`/${schemaId}/statuses/${statusName}`)
      .reply(200, {
        affectedRecords: 1,
      });
    const res = await sdk.data.statuses.remove(schemaId, statusName);
    expect(res.affectedRecords).toBe(1);
  });
});
