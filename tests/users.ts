import { assert } from 'console';
import * as sdk from '../src/index';
import { Gender, RegisterUserData } from '../src/users/models';

describe('Get Me', () => {
  it('should return current user', async () => {
    const user = await sdk.users.getCurrent();
    assert(user.firstName);
  });
});

describe('get user list', () => {
  it('should return user list', async () => {
    const list = await sdk.users.getList();
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
    const user = await sdk.users.getById('58074800b2148f3b28ad7590');
    expect(user.firstName);
  });
});

describe('update user by id', () => {
  it('should updated user', async () => {
    const user = await sdk.users.update('5807484fb2148f3b28ad7747', { firstName: 'Bobxx' });
    expect(user.firstName).toBe('Bobxx');
  });
});

describe('update user email', () => {
  it('should updated user email', async () => {
    const user = await sdk.users.updateEmail('6023b22546e0fb0007ab3e1b', 'test@fibri.com');
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
      email: 'blinde.vink3@qompium.com',
      password: 'Test12345',
      phoneNumber: '12345',
      birthday: '1969-06-20',
      gender: Gender.NotApplicable,
      country: 'BE',
      language: 'NL',
    };
    const user = await sdk.users.register(registerData);
    expect(user.email).toBe(registerData.email);
  });
});

describe('register user', () => {
  it('should register user', async () => {
    const registerData: RegisterUserData = {
      firstName: 'Test',
      lastName: 'Tester',
      email: 'peter.pieters@qompium.com',
      password: 'Test12345',
      phoneNumber: '12345',
      birthday: '1969-06-20',
      gender: Gender.NotApplicable,
      country: 'BE',
      language: 'NL',
    };
    const user = await sdk.users.register(registerData);
    expect(user.email).toBe(registerData.email);
  });
});

describe('request activation email', () => {
  it('should send activation mail user', async () => {
    const user = await sdk.users.requestActivationMail('peter.pieters@qompium.com');
    expect(user).toBe('peter.pieters@qompium.com');
  });
});

describe('complete activation email', () => {
  it('should complete activation mail', async () => {
    const user = await sdk.users.completeActivationMail('251c08c2267b436ebd1c8005c2be0ee4505e541d');
    expect(user).toBe('peter.pieters@qompium.com');
  });
});

describe('request forgot password', () => {
  it('should send forgot password mail', async () => {
    const result = await sdk.users.requestPasswordReset('peter.pieters@qompium.com');
    expect(result).toBeTruthy();
  });
});

describe('check email available', () => {
  it('should check if email is available', async () => {
    const result = await sdk.users.emailAvailable('peter.pieters@qompium.com');
    expect(result).toBeTruthy();
  });
});
