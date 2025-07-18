import nock from 'nock';
import {createOAuth2Client} from '../../../../src';
import {TASKS_BASE} from '../../../../src/constants';
import {randomUser, User, userData, UserResponse, UsersResponse,} from '../../../__helpers__/api';
import {randomHexString} from '../../../__helpers__/utils';

describe('Tasks - Functions - API', () => {
  const host = 'https://api.xxx.extrahorizon.com';
  const functionName = 'test';

  const exh = createOAuth2Client({
    host,
    clientId: '',
  });

  it('Executes a GET request towards an API Function', async () => {
    nock(`${host}${TASKS_BASE}`)
      .get(`/api/${functionName}/users`)
      .reply(200, { users: userData });

    const { users } = await exh.tasks.api.get<UsersResponse>(
      functionName,
      'users',
      {}
    );
    expect(users).toMatchObject(userData);
  });

  it('Executes a POST request towards an API Function', async () => {
    const newUser: User = randomUser();

    nock(`${host}${TASKS_BASE}`)
      .post(`/api/${functionName}/users`)
      .reply(200, { user: newUser });

    const { user } = await exh.tasks.api.post<UserResponse, User>(
      functionName,
      '/users',
      newUser,
      {}
    );
    expect(user).toMatchObject(newUser);
  });

  it('Executes a PUT request towards an API Function', async () => {
    const updatedUser = randomUser();

    nock(`${host}${TASKS_BASE}`)
      .put(`/api/${functionName}/users/${userData[0].id}`)
      .reply(200, { user: updatedUser });

    const { user } = await exh.tasks.api.put<UserResponse, User>(
      functionName,
      `users/${userData[0].id}`,
      updatedUser,
      {}
    );
    expect(user).toMatchObject(updatedUser);
  });

  it('Executes a DELETE request towards an API Function', async () => {
    const updatedUsers = [...userData].pop();

    nock(`${host}${TASKS_BASE}`)
      .delete(`/api/${functionName}/users/${userData[userData.length - 1].id}`)
      .reply(200, { users: updatedUsers });

    const { users } = await exh.tasks.api.delete<UsersResponse>(
      functionName,
      `/users/${userData[userData.length - 1].id}`,
      {}
    );
    expect(users).toMatchObject(updatedUsers);
  });

  it('Executes a PATCH request towards an API Function', async () => {
    const update = { email: `${randomHexString()}@${randomHexString()}.com` };
    const updatedUser = { ...userData[0], update };

    nock(`${host}${TASKS_BASE}`)
      .patch(`/api/${functionName}/users/${userData[0].id}`)
      .reply(200, { user: updatedUser });

    const { user } = await exh.tasks.api.patch<UserResponse, Partial<User>>(
      functionName,
      `users/${userData[0].id}`,
      update,
      {}
    );
    expect(user).toMatchObject(updatedUser);
  });
});
