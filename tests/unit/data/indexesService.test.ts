import nock from 'nock';
import { AUTH_BASE, DATA_BASE } from '../../../src/constants';
import { Client, createClient, ParamsOauth2 } from '../../../src/index';
import {
  newSchemaCreated,
  newIndexCreated,
  newIndexInput,
} from '../../__helpers__/data';

describe('Indexes Service', () => {
  const schemaId = newSchemaCreated.id as string;
  const indexId = newIndexCreated.id;
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

  it('should create an index', async () => {
    nock(`${host}${DATA_BASE}`)
      .post(`/${schemaId}/indexes`)
      .reply(200, newIndexCreated);
    const index = await sdk.data.indexes.create(schemaId, newIndexInput);
    expect(index.id).toBe(newIndexCreated.id);
  });

  it('should delete an index', async () => {
    nock(`${host}${DATA_BASE}`)
      .delete(`/${schemaId}/indexes/${indexId}`)
      .reply(200, {
        affectedRecords: 1,
      });
    const res = await sdk.data.indexes.remove(indexId, schemaId);
    expect(res.affectedRecords).toBe(1);
  });
});
