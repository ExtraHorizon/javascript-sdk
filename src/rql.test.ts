import rqlBuilder from './rql';

describe('rql string builder', () => {
  console.log('test', rqlBuilder());
  it('parse select', async () => {
    const rql = rqlBuilder();
    const result = rql.select(['name', 'id']).toString();
    expect(result).toBe('?select(name,id)');
  });

  it('parse limit', async () => {
    const result = rqlBuilder().limit(10, 15).toString();
    expect(result).toBe('?limit(10,15)');
  });

  it('parse limit + offset', async () => {
    const result = rqlBuilder().limit(10).toString();
    expect(result).toBe('?limit(10)');
  });

  it('parse select + limit', async () => {
    const result = rqlBuilder().select(['name', 'id']).limit(10, 15).toString();
    expect(result).toBe('?select(name,id)&limit(10,15)');
  });

  it('parse select + in', async () => {
    const result = rqlBuilder()
      .select(['name', 'id'])
      .in('name', ['fitbit'])
      .toString();
    expect(result).toBe('?select(name,id)&in(name,fitbit)');
  });

  it('parse select + sort', async () => {
    const result = rqlBuilder()
      .select(['name', 'id'])
      .sort(['name'])
      .toString();
    expect(result).toBe('?select(name,id)&sort(name)');
  });

  it('parse select + inverted sort', async () => {
    const result = rqlBuilder()
      .select(['name', 'id'])
      .sort(['-name'])
      .toString();
    expect(result).toBe('?select(name,id)&sort(-name)');
  });

  it('parse select + sort on multiple fields', async () => {
    const result = rqlBuilder()
      .select(['name', 'id'])
      .sort(['name', '-description'])
      .toString();
    expect(result).toBe('?select(name,id)&sort(name,-description)');
  });

  it('parse select + name like fitbit', async () => {
    const result = rqlBuilder()
      .select(['name', 'id'])
      .like('name', 'fitbit')
      .toString();
    expect(result).toBe('?select(name,id)&like(name,fitbit)');
  });
});
