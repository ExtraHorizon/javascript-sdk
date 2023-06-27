// eslint-disable-next-line import/no-extraneous-dependencies
import nock from 'nock';
import { createClient } from '../../../../src';
import { TASKS_BASE } from '../../../../src/constants';
import {
  UsersResponse,
  UserResponse,
  randomUser,
  User,
  userData,
} from '../../../__helpers__/api';
import { randomHexString } from '../../../__helpers__/utils';

describe('Tasks - Functions - API', () => {
  const host = 'https://api.xxx.extrahorizon.com';
  const name = 'test';

  const exh = createClient({
    host,
    clientId: '',
  });

  it('Retrieves data from an API Function', async () => {
    nock(`${host}${TASKS_BASE}`)
      .get(`/api/${name}/users`)
      .reply(200, { users: userData });

    const { users } = await exh.tasks.api.get<UsersResponse>(name, 'users', {});
    expect(users).toMatchObject(userData);
  });

  it('Creates a new user', async () => {
    const newUser: User = randomUser();

    nock(`${host}${TASKS_BASE}`)
      .post(`/api/${name}/users`)
      .reply(200, { user: newUser });

    const { user } = await exh.tasks.api.post<UserResponse, User>(
      name,
      'users',
      newUser,
      {}
    );
    expect(user).toMatchObject(newUser);
  });

  it('Replaces and existing user', async () => {
    const updatedUser = randomUser();

    nock(`${host}${TASKS_BASE}`)
      .put(`/api/${name}/users/${userData[0].id}`)
      .reply(200, { user: updatedUser });

    const { user } = await exh.tasks.api.put<UserResponse, User>(
      name,
      `users/${userData[0].id}`,
      updatedUser,
      {}
    );
    expect(user).toMatchObject(updatedUser);
  });

  it('Removes a user', async () => {
    const updatedUsers = [...userData].pop();

    nock(`${host}${TASKS_BASE}`)
      .delete(`/api/${name}/users/${userData[userData.length - 1].id}`)
      .reply(200, { users: updatedUsers });

    const { users } = await exh.tasks.api.delete<UsersResponse>(
      name,
      `users/${userData[userData.length - 1].id}`,
      {}
    );
    expect(users).toMatchObject(updatedUsers);
  });

  it('Updates and existing user', async () => {
    const update = { email: `${randomHexString()}@${randomHexString()}.com` };
    const updatedUser = { ...userData[0], update };

    nock(`${host}${TASKS_BASE}`)
      .patch(`/api/${name}/users/${userData[0].id}`)
      .reply(200, { user: updatedUser });

    const { user } = await exh.tasks.api.patch<UserResponse, Partial<User>>(
      name,
      `users/${userData[0].id}`,
      update,
      {}
    );
    expect(user).toMatchObject(updatedUser);
  });
});
