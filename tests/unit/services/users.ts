import * as nock from 'nock';
import { UsersService } from '../../../src/services/users';

describe('Users Service', () => {
  let usersService: UsersService;

  beforeEach(() => {
    usersService = new UsersService('/users/v1');
  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it('health()', async () => {
    const res = await usersService.health();
    expect(res).toBe(true);
  });

  it('me()', async () => {
    // nock(`https://api.${apiHost}/users/v1`)
    //   .get('/me')
    //   .reply(200, userData);

    const user = await usersService.me();
    expect(user.id).toBeDefined();
  });

  it('findById()', async () => {
    // nock(`https://api.${apiHost}/users/v1`)
    //   .get('/')
    //   .reply(200, userResponse);
    const user = await usersService.findById('12345');
    expect(user).toContain({ id: '12345' });
  });

  it('findById(): user not found', async () => {
    // nock(`https://api.${apiHost}/users/v1`)
    //   .get(`/${userId}`)
    //   .reply(404, ResourceUnknownException);

    let thrownError;
    try {
      await usersService.findById('12345');
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError.qError.qName).toBe('RESOURCE_UNKNOWN_EXCEPTION');
  });
});
