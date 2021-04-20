import * as nock from 'nock';
import { AUTH_BASE, DATA_BASE } from '../../../src/constants';
import { Client, client } from '../../../src/index';
import { newSchemaInput, newSchemaCreated } from '../../__helpers__/data';

describe('Schemas Service', () => {
  const apiHost = 'https://api.xxx.fibricheck.com';
  let sdk: Client;

  beforeAll(() => {
    sdk = client({
      apiHost,
      oauth: {
        clientId: '',
        username: '',
        password: '',
      },
    });

    const mockToken = 'mockToken';
    nock(apiHost)
      .post(`${AUTH_BASE}/oauth2/token`)
      .reply(200, { access_token: mockToken });
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
});
