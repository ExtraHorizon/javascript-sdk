import nock from 'nock';
import { AUTH_BASE, DATA_BASE } from '../../../src/constants';
import { Client, client } from '../../../src/index';
import { transitionInput, newTransition } from '../../__helpers__/data';

describe('Transitions Service', () => {
  const schemaId = '2e9fff9d90135a2a9a718e2f';
  const transitionId = '1e9fff9d90135a2a9a718e2f';
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

  it('Create a transition', async () => {
    nock(`${apiHost}${DATA_BASE}`)
      .post(`/${schemaId}/transitions`)
      .reply(200, { ...newTransition, id: transitionId });
    const createdTransition = await sdk.data.createTransition(
      schemaId,
      newTransition
    );
    expect(createdTransition.id).toBe(transitionId);
  });

  it('Update a transition', async () => {
    nock(`${apiHost}${DATA_BASE}`)
      .put(`/${schemaId}/transitions/${transitionId}`)
      .reply(200, { affectedRecords: 1 });
    const res = await sdk.data.updateTransition(
      schemaId,
      transitionId,
      newTransition
    );
    expect(res.affectedRecords).toBe(1);
  });

  it('Delete a transition', async () => {
    nock(`${apiHost}${DATA_BASE}`)
      .delete(`/${schemaId}/transitions/${transitionId}`)
      .reply(200, { affectedRecords: 1 });
    const res = await sdk.data.deleteTransition(schemaId, transitionId);
    expect(res.affectedRecords).toBe(1);
  });
});
