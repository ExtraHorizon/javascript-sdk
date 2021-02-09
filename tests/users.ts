import { assert } from 'console';
import * as sdk from '../src/index';

describe('Get Me', () => {
  it('should return current user', async () => {
    const user = await sdk.users.getMe();
    assert(user.firstName);
  });
});
