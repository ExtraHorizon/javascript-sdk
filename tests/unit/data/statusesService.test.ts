import nock from 'nock';
import { AUTH_BASE, DATA_BASE } from '../../../src/constants';
import { Client, client } from '../../../src/index';
import { newSchemaCreated } from '../../__helpers__/data';

describe('Statuses Service', () => {
  const schemaId = newSchemaCreated.id;
  const statusName = 'pending';
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

    await sdk.auth.authenticate({
      clientId: '',
      username: '',
      password: '',
    });
  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it('Create a status', async () => {
    nock(`${apiHost}${DATA_BASE}`)
      .post(`/${schemaId}/statuses`)
      .reply(200, { affectedRecords: 1 });
    const res = await sdk.data.createStatus(schemaId, { name: statusName });
    expect(res.affectedRecords).toBe(1);
  });

  it('Update a status', async () => {
    nock(`${apiHost}${DATA_BASE}`)
      .put(`/${schemaId}/statuses/${statusName}`)
      .reply(200, {
        affectedRecords: 1,
      });
    const res = await sdk.data.updateStatus(schemaId, statusName, {
      additionalProp1: 'string',
      additionalProp2: 'string',
      additionalProp3: 'string',
    });
    expect(res.affectedRecords).toBe(1);
  });

  it('Delete a status', async () => {
    nock(`${apiHost}${DATA_BASE}`)
      .delete(`/${schemaId}/statuses/${statusName}`)
      .reply(200, {
        affectedRecords: 1,
      });
    const res = await sdk.data.deleteStatus(schemaId, statusName);
    expect(res.affectedRecords).toBe(1);
  });
});
