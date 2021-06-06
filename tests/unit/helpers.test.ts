import { rqlBuilder } from '../../src/rql';
import { getRql } from '../../src/services/helpers';

describe('Helpers', () => {
  it('should get rql string filtered by id without builder', () => {
    const rql = getRql({ id: 'someId' });
    expect(rql).toBe('?eq(id,someId)');
  });

  it('should get rql string filtered by id', () => {
    const rql = getRql({ id: 'someId' }, rqlBuilder().select('name'));
    expect(rql).toBe('?select(name)&eq(id,someId)');
  });

  it('should get rql string filtered by name', () => {
    const rql = getRql({ name: 'someName' }, rqlBuilder().select('name'));
    expect(rql).toBe('?select(name)&eq(name,someName)');
  });

  it('should get rql string filtered by id and name', () => {
    const rql = getRql(
      { id: 'someId', name: 'someName' },
      rqlBuilder().select(['id', 'name'])
    );
    expect(rql).toBe('?select(id,name)&eq(id,someId)&eq(name,someName)');
  });
});
