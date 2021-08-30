import { rqlBuilder } from '../../src/rql';

describe('rql string builder', () => {
  it('should build a valid select', async () => {
    const rql = rqlBuilder();
    const result = rql.select(['name', 'id']).build();
    expect(result).toBe('?select(name,id)');
  });

  it('should build a valid select with a space', async () => {
    const rql = rqlBuilder();
    const result = rql.select(["'first name'", 'id']).build();
    expect(result).toBe(`?select('first name',id)`);
  });

  it('should build a valid limit with offset', async () => {
    const result = rqlBuilder().limit(10, 15).build();
    expect(result).toBe('?limit(10,15)');
  });

  it('should build a valid limit', async () => {
    const result = rqlBuilder().limit(10).build();
    expect(result).toBe('?limit(10)');
  });

  it('should build a valid select with limit', async () => {
    const result = rqlBuilder().select('name').limit(10, 15).build();
    expect(result).toBe('?select(name)&limit(10,15)');
  });

  it('should build a valid greater equals', async () => {
    const result = rqlBuilder().ge('value', '10').build();
    expect(result).toBe('?ge(value,10)');
  });

  it('should build a valid lesser equals', async () => {
    const result = rqlBuilder().le('value', '10').build();
    expect(result).toBe('?le(value,10)');
  });

  it('should build a valid and with eq operator', async () => {
    const result = rqlBuilder()
      .and(rqlBuilder().eq('value', '10').intermediate())
      .build();
    expect(result).toBe('?and(eq(value,10))');
  });

  it('should build a valid and with eq operator', async () => {
    const result = rqlBuilder()
      .and(
        rqlBuilder().lt('value', '20').intermediate(),
        rqlBuilder().gt('value', '10').intermediate()
      )
      .build();
    expect(result).toBe('?and(lt(value,20),gt(value,10))');
  });

  it('should build a valid and with ne operator', async () => {
    const result = rqlBuilder()
      .and(rqlBuilder().ne('value', '10').intermediate())
      .build();
    expect(result).toBe('?and(ne(value,10))');
  });

  it('should build a valid select with in operator', async () => {
    const result = rqlBuilder()
      .select(['name', 'id'])
      .in('name', ['fitbit'])
      .build();
    expect(result).toBe('?select(name,id)&in(name,fitbit)');
  });

  it('should build a valid select with sort operator', async () => {
    const result = rqlBuilder().select(['name', 'id']).sort('name').build();
    expect(result).toBe('?select(name,id)&sort(name)');
  });

  it('should build a valid select with an inverted sort', async () => {
    const result = rqlBuilder().select(['name', 'id']).sort('-name').build();
    expect(result).toBe('?select(name,id)&sort(-name)');
  });

  it('should build a valid select with sort on multiple fields', async () => {
    const result = rqlBuilder()
      .select(['name', 'id'])
      .sort(['name', '-description'])
      .build();
    expect(result).toBe('?select(name,id)&sort(name,-description)');
  });

  it('should build a valid select with a name like fitbit', async () => {
    const result = rqlBuilder()
      .select(['name', 'id'])
      .like('name', 'fitbit')
      .build();
    expect(result).toBe('?select(name,id)&like(name,fitbit)');
  });

  it('should build a valid rql with or operator  with a name like fitbit or bitfit', async () => {
    const likeFitbit = rqlBuilder().like('name', 'fitbit').intermediate();
    const likeBitFit = rqlBuilder().like('name', 'bitfit').intermediate();
    const result = rqlBuilder().or(likeBitFit, likeFitbit).build();
    expect(result).toBe('?or(like(name,bitfit),like(name,fitbit))');
  });

  it('should build a valid rql with contains and or operator', async () => {
    const groupId = '2313232';
    const filterValue = 'Test';
    const pageSize = 20;
    const pageIndex = 1;

    const eqGroupId = rqlBuilder().eq('group_id', groupId).intermediate();
    const containsStaff = rqlBuilder()
      .contains('staff_enlistments', eqGroupId)
      .intermediate();
    const firstNamelikeFilterValue = rqlBuilder()
      .like('first_name', filterValue)
      .intermediate();
    const lastNamelikeFilterValue = rqlBuilder()
      .like('last_name', filterValue)
      .intermediate();
    const result = rqlBuilder(containsStaff)
      .or(firstNamelikeFilterValue, lastNamelikeFilterValue)
      .limit(pageSize, pageSize * pageIndex)
      .build();

    expect(result).toBe(
      `?contains(staff_enlistments,eq(group_id,${groupId}))&or(like(first_name,${filterValue}),like(last_name,${filterValue}))&limit(${pageSize},${
        pageSize * pageIndex
      })`
    );
  });

  it('should parse a string to rqlString', async () => {
    const parsed = rqlBuilder().parse(
      'or(like(name,bi,tfit),eq(),like(name,fitbit))'
    );

    expect(parsed).toBe('or(like(name,bi,tfit),eq(),like(name,fitbit))');
  });

  it('should throw an error on parsing invalid RQL to rqlString', async () => {
    expect(() => {
      rqlBuilder().parse('or((like(name,btfit))');
    }).toThrowError();
  });
});
