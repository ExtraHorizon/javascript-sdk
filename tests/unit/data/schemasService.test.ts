import * as nock from 'nock';
import { AUTH_BASE, DATA_BASE } from '../../../src/constants';
import { Client, client } from '../../../src/index';
import { newSchemaData } from '../../__helpers__/data';
import {
  CreateMode,
  ReadMode,
  UpdateMode,
  DeleteMode,
  GroupSyncMode,
} from '../../../src/services/data/types';

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
    nock(`${apiHost}${DATA_BASE}`).post('/').reply(200, newSchemaData);
    const schema = await sdk.data.createSchema({
      name: 'Fibricheck measurement',
      description: 'The schema for holding FibriCheck measurements',
      createMode: CreateMode.DEFAULT,
      readMode: ReadMode.ALL_USERS,
      updateMode: UpdateMode.DEFAULT,
      deleteMode: DeleteMode.PERMISSION_REQUIRED,
      groupSyncMode: GroupSyncMode.DISABLED,
      defaultLimit: 5,
      maximumLimit: 5,
    });
    expect(schema.creationTransition).toBeDefined();
  });
});
