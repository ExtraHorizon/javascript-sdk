import nock from 'nock';
import { AUTH_BASE, DISPATCHERS_BASE } from '../../../src/constants';
import { Client, createClient, ParamsOauth2 } from '../../../src/index';
import {
  dispatcherData,
  mailAction,
  mailActionInput,
} from '../../__helpers__/dispatcher';

describe('Actions Service', () => {
  const apiHost = 'https://api.xxx.fibricheck.com';
  const dispatcherId = dispatcherData.id;
  const actionId = mailAction.id;

  let sdk: Client<ParamsOauth2>;

  beforeAll(async () => {
    sdk = createClient({
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

  it('should add an action to the dispatcher', async () => {
    nock(`${apiHost}${DISPATCHERS_BASE}`)
      .post(`/${dispatcherId}/actions`)
      .reply(200, mailAction);

    const res = await sdk.dispatchers.actions.create(
      dispatcherId,
      mailActionInput
    );

    expect(res.id).toBe(mailAction.id);
  });

  it('should update an action for the specified dispatcher', async () => {
    nock(`${apiHost}${DISPATCHERS_BASE}`)
      .put(`/${dispatcherId}/actions/${actionId}`)
      .reply(200, {
        affectedRecords: 1,
      });

    const res = await sdk.dispatchers.actions.update(
      dispatcherId,
      actionId,
      mailActionInput
    );

    expect(res.affectedRecords).toBe(1);
  });

  it('should delete an action from the specified dispatcher', async () => {
    nock(`${apiHost}${DISPATCHERS_BASE}`)
      .delete(`/${dispatcherId}/actions/${actionId}`)
      .reply(200, {
        affectedRecords: 1,
      });

    const res = await sdk.dispatchers.actions.delete(dispatcherId, actionId);

    expect(res.affectedRecords).toBe(1);
  });
});
