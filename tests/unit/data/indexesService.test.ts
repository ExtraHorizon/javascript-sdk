import nock from 'nock';
import { AUTH_BASE, DATA_BASE } from '../../../src/constants';
import { Client, client, ParamsOauth2 } from '../../../src/index';
import {
  newSchemaCreated,
  newIndexCreated,
  newIndexInput,
} from '../../__helpers__/data';

describe('Indexes Service', () => {
  const schemaId = newSchemaCreated.id;
  const indexId = newIndexCreated.id;
  const apiHost = 'https://api.xxx.fibricheck.com';
  let sdk: Client<ParamsOauth2>;

  beforeAll(async () => {
    sdk = client({
      apiHost,
      clientId: '',
    });

    const mockToken = 'mockToken';
    nock(apiHost)
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

  it('should create an index', async () => {
    nock(`${apiHost}${DATA_BASE}`)
      .post(`/${schemaId}/indexes`)
      .reply(200, newIndexCreated);
    const index = await sdk.data.createIndex(schemaId, newIndexInput);
    expect(index.id).toBe(newIndexCreated.id);
  });

  it('should delete an index', async () => {
    nock(`${apiHost}${DATA_BASE}`)
      .delete(`/${schemaId}/indexes/${indexId}`)
      .reply(200, {
        affectedRecords: 1,
      });
    const res = await sdk.data.deleteIndex(indexId, schemaId);
    expect(res.affectedRecords).toBe(1);
  });
});
