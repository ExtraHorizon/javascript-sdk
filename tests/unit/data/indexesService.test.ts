import nock from 'nock';
import { AUTH_BASE, DATA_BASE } from '../../../src/constants';
import { Client, client } from '../../../src/index';
import {
  newSchemaCreated,
  newIndexCreated,
  newIndexInput,
} from '../../__helpers__/data';

describe('Indexes Service', () => {
  const schemaId = newSchemaCreated.id;
  const indexId = newIndexCreated.id;
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

  it('Create an index', async () => {
    nock(`${apiHost}${DATA_BASE}`)
      .post(`/${schemaId}/indexes`)
      .reply(200, newIndexCreated);
    const index = await sdk.data.createIndex(schemaId, newIndexInput);
    expect(index.id).toBe(newIndexCreated.id);
  });

  it('Delete an index', async () => {
    nock(`${apiHost}${DATA_BASE}`)
      .delete(`/${schemaId}/indexes/${indexId}`)
      .reply(200, {
        affectedRecords: 1,
      });
    const res = await sdk.data.deleteIndex(indexId, schemaId);
    expect(res.affectedRecords).toBe(1);
  });
});
