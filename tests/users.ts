import { assert } from 'console';
import * as sdk from '../src/index';
import { RegisterUserData } from '../src/users/models';

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
  it('should updated user', async () => {
    const user = await sdk.users.updateUser('5807484fb2148f3b28ad7747', { first_name: 'Bob' });
    expect(user.firstName).toBe('Bob');
  });
});

describe('update user email', () => {
  it('should updated user email', async () => {
    const user = await sdk.users.updateUserEmail('6023b22546e0fb0007ab3e1b', 'test@fibri.com');
    expect(user.email).toBe('test@fibri.com');
  });
});

describe('add patient enlistment', () => {
  it('should add patient enlistmentl', async () => {
    const result = await sdk.users.addPatientEnlistment('6023b22546e0fb0007ab3e1b', '5d3ebb1259080100098d3517');
    expect(result).toBeTruthy();
  });
});

describe('delete patient enlistment', () => {
  it('should delete patient enlistment', async () => {
    const result = await sdk.users.deletePatientEnlistment('6023b22546e0fb0007ab3e1b', '5d3ebb1259080100098d3517');
    expect(result).toBeTruthy();
  });
});

describe('register user', () => {
  it('should register user', async () => {
    const registerData: RegisterUserData = {
      firstName: 'Test',
      lastName: 'Tester',
      email: 'test.tester@qompium.com',
      password: 'Test12345',
      phoneNumber: '12345',
      birthday: '1969-06-20',
      gender: 1,
      country: 'BE',
      language: 'NL',
    };
    const user = await sdk.users.registerUser(registerData);
    expect(user.email).toBe('test.pieter@qompium.com');
  });
});
