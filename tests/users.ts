import * as sdk from '../build';

describe('Get Pokemon By Id', () => {
  it('should contain an id', async () => {
    const test = sdk.getPokemonById(8);
    console.log(test);
  });
});
