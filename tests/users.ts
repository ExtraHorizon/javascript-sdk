import { assert } from 'console';
import * as sdk from '../src/index';

describe('Get Me', () => {
  it('should return current user', async () => {
    const user = await sdk.users.getMe();
    assert(user.firstName);
  });
});

describe('get user list', () => {
  it('should return user list', async () => {
    const list = await sdk.users.getUsers();
    assert(list.page.total);
  });
});

describe('get patients list', () => {
  it('should return patients list', async () => {
    const list = await sdk.users.getPatients();
    assert(list.page.total);
  });
});

describe('get staff list', () => {
  it('should return staff list', async () => {
    const list = await sdk.users.getStaff();
    assert(list.page.total);
  });
});

describe('get user by id', () => {
  it('should return current user', async () => {
    const user = await sdk.users.getUserById('58074800b2148f3b28ad7590');
    expect(user.firstName);
  });
});

describe('update user by id', () => {
  it('should return updated user', async () => {
    const user = await sdk.users.updateUser('5807484fb2148f3b28ad7747', { first_name: 'Bob' });
    expect(user.firstName).toBe('Bob');
  });
});
