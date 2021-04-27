import nock from 'nock';
import { AUTH_BASE, DATA_BASE } from '../../../src/constants';
import { Client, client } from '../../../src/index';
import { newSchemaCreated, transitionInput } from '../../__helpers__/data';

describe('Transitions Service', () => {
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

  it('Update the creation transition', async () => {
    nock(`${apiHost}${DATA_BASE}`)
      .put(`/${schemaId}/creationTransition`)
      .reply(200, { affectedRecords: 1 });
    const res = await sdk.data.updateCreationTransition(
      schemaId,
      transitionInput
    );
    expect(res.affectedRecords).toBe(1);
  });
});
