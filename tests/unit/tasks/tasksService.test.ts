import * as nock from 'nock';
import { AUTH_BASE, TASKS_BASE } from '../../../src/constants';
import { Client, client } from '../../../src/index';
import { taskData, tasksResponse } from '../../__helpers__/task';

describe('Tasks Service', () => {
  const apiHost = 'https://api.xxx.fibricheck.com';
  const taskId = taskData.id;

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

  it('View a list of tasks', async () => {
    nock(`${apiHost}${TASKS_BASE}`).get('/').reply(200, tasksResponse);

    const res = await sdk.tasks.getList();

    expect(res.data.length).toBeGreaterThan(0);
  });

  it('Create a task', async () => {
    nock(`${apiHost}${TASKS_BASE}`).post('/').reply(200, taskData);

    const task = await sdk.tasks.createTask({
      functionName: 'test function',
      priority: 5,
    });

    expect(task.functionName).toBeDefined();
  });

  it('Cancel a task', async () => {
    nock(`${apiHost}${TASKS_BASE}`).post(`/${taskId}/cancel`).reply(200, {
      affectedRecords: 1,
    });

    const res = await sdk.tasks.cancelTask(taskId);

    expect(res.affectedRecords).toBe(1);
  });
});
