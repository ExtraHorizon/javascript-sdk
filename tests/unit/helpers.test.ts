import { withFindMethods } from '../../src/services/helpers';

describe('Helpers', () => {
  const find = jest.fn(() => Promise.resolve({ data: ['first', 'second'] }));
  let findMethods;

  beforeEach(() => {
    findMethods = withFindMethods(find);
  });

  it('should return findById, findByName and findFirst methods', () => {
    expect(findMethods.findById).toBeDefined();
    expect(findMethods.findByName).toBeDefined();
    expect(findMethods.findFirst).toBeDefined();
  });

  it('findById should call find with given params', async () => {
    const res = await findMethods.findById('someId', 'arg1', 'arg2');
    expect(find).toHaveBeenCalledWith('arg1', 'arg2', {
      rql: '?eq(id,someId)',
    });
    expect(res).toBe('first');
  });

  it('findByName should call find with given params', async () => {
    const res = await findMethods.findByName('someName', 'arg1', 'arg2');
    expect(find).toHaveBeenCalledWith('arg1', 'arg2', {
      rql: '?eq(name,someName)',
    });
    expect(res).toBe('first');
  });

  it('findFirst should call find with given params', async () => {
    const res = await findMethods.findFirst({ rql: "?select('name')" });
    expect(find).toHaveBeenCalledWith({
      rql: "?select('name')",
    });
    expect(res).toBe('first');
  });
});
