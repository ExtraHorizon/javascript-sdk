import nock from 'nock';
import { AUTH_BASE, DATA_BASE } from '../../../src/constants';
import { Client, client, ParamsOauth2 } from '../../../src/index';
import { transitionInput, newTransition } from '../../__helpers__/data';

describe('Transitions Service', () => {
  const schemaId = '2e9fff9d90135a2a9a718e2f';
  const transitionId = '1e9fff9d90135a2a9a718e2f';
  const apiHost = 'https://api.xxx.fibricheck.com';
  let sdk: Client<ParamsOauth2>;

  beforeAll(async () => {
    try {
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
    } catch (error) {
      console.log('before', error);
    }
  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it('should update the creation transition', async () => {
    try {
      nock(`${apiHost}${DATA_BASE}`)
        .put(`/${schemaId}/creationTransition`)
        .reply(200, { affectedRecords: 1 });
      const res = await sdk.data.transitions.updateCreation(
        schemaId,
        transitionInput
      );

      expect(res.affectedRecords).toBe(1);
    } catch (error) {
      console.log('error', error);
    }
  });

  it('should create a transition', async () => {
    nock(`${apiHost}${DATA_BASE}`)
      .post(`/${schemaId}/transitions`)
      .reply(200, { ...newTransition, id: transitionId });
    const createdTransition = await sdk.data.transitions.create(
      schemaId,
      newTransition
    );
    expect(createdTransition.id).toBe(transitionId);
  });

  it('should update a transition', async () => {
    nock(`${apiHost}${DATA_BASE}`)
      .put(`/${schemaId}/transitions/${transitionId}`)
      .reply(200, { affectedRecords: 1 });
    const res = await sdk.data.transitions.update(
      schemaId,
      transitionId,
      newTransition
    );
    expect(res.affectedRecords).toBe(1);
  });

  it('should delete a transition', async () => {
    nock(`${apiHost}${DATA_BASE}`)
      .delete(`/${schemaId}/transitions/${transitionId}`)
      .reply(200, { affectedRecords: 1 });
    const res = await sdk.data.transitions.delete(schemaId, transitionId);
    expect(res.affectedRecords).toBe(1);
  });
});
