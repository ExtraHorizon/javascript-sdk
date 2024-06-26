import nock from 'nock';
import { AUTH_BASE, TASKS_BASE } from '../../../src/constants';
import {
  Client,
  createClient,
  ParamsOauth2,
  rqlBuilder,
} from '../../../src/index';
import { taskData } from '../../__helpers__/task';
import { createPagedResponse } from '../../__helpers__/utils';

describe('Tasks Service', () => {
  const host = 'https://api.xxx.extrahorizon.io';
  const taskId = taskData.id;
  const tasksResponse = createPagedResponse(taskData);

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

  it('should view a list of tasks', async () => {
    const rql = rqlBuilder().build();
    nock(`${host}${TASKS_BASE}`).get('/').reply(200, tasksResponse);

    const res = await sdk.tasks.find({ rql });

    expect(res.data.length).toBeGreaterThan(0);
  });

  it('should request a list of all tasks', async () => {
    nock(`${host}${TASKS_BASE}`)
      .get('/?limit(50)')
      .reply(200, {
        page: {
          total: 65,
          offset: 0,
          limit: 50,
        },
        data: Array(50).fill(taskData),
      })
      .get('/?limit(50,50)')
      .reply(200, {
        page: {
          total: 65,
          offset: 50,
          limit: 50,
        },
        data: Array(15).fill(taskData),
      });
    const res = await sdk.tasks.findAll();
    expect(res.length).toBe(65);
  });

  it('should request a list of all tasks via iterator', async () => {
    nock(`${host}${TASKS_BASE}`)
      .get('/?limit(50)')
      .reply(200, {
        page: {
          total: 55,
          offset: 0,
          limit: 50,
        },
        data: Array(50).fill(taskData),
      })
      .get('/?limit(50,50)')
      .reply(200, {
        page: {
          total: 55,
          offset: 50,
          limit: 50,
        },
        data: Array(5).fill(taskData),
      });
    const tasks = sdk.tasks.findAllIterator();

    await tasks.next();
    const thirdPage = await tasks.next();
    expect(thirdPage.value.data.length).toBe(5);
  });

  it('should find a task by id', async () => {
    nock(`${host}${TASKS_BASE}`)
      .get(`/?eq(id,${taskId})`)
      .reply(200, tasksResponse);

    const task = await sdk.tasks.findById(taskId);

    expect(task.id).toBe(taskId);
  });

  it('should find the first task', async () => {
    nock(`${host}${TASKS_BASE}`).get('/').reply(200, tasksResponse);

    const task = await sdk.tasks.findFirst();

    expect(task.id).toBe(taskId);
  });

  it('should create a task', async () => {
    nock(`${host}${TASKS_BASE}`).post('/').reply(200, taskData);

    const task = await sdk.tasks.create({
      functionName: 'test function',
      priority: 5,
    });

    expect(task.functionName).toBeDefined();
  });

  it('should cancel a task', async () => {
    nock(`${host}${TASKS_BASE}`).post(`/${taskId}/cancel`).reply(200, {
      affectedRecords: 1,
    });

    const res = await sdk.tasks.cancel(taskId);

    expect(res.affectedRecords).toBe(1);
  });
});
