import { rqlBuilder, rqlParser } from '../../src/rql';

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
      `?contains(staff_enlistments,and(eq(group_id,${groupId})))&or(like(first_name,${filterValue}),like(last_name,${filterValue}))&limit(${pageSize},${
        pageSize * pageIndex
      })`
    );
  });

  it('should build a valid skipCount() operator', async () => {
    const result = rqlBuilder().skipCount().build();

    expect(result).toBe('?skipCount()');
  });

  it('should build a valid skipCount() operator within an AND operator', async () => {
    const result = rqlBuilder()
      .and(
        rqlBuilder().eq('firstName', 'Joe').intermediate(),
        rqlBuilder().eq('secondName', 'Bloggs').intermediate(),
        rqlBuilder().skipCount().intermediate()
      )
      .build();

    expect(result).toBe(
      '?and(eq(firstName,Joe),eq(secondName,Bloggs),skipCount())'
    );
  });

  it('should build a valid skipCount() operator within an OR operator', async () => {
    const result = rqlBuilder()
      .or(
        rqlBuilder().eq('firstName', 'Joe').intermediate(),
        rqlBuilder().eq('secondName', 'Bloggs').intermediate(),
        rqlBuilder().skipCount().intermediate()
      )
      .build();

    expect(result).toBe(
      '?or(eq(firstName,Joe),eq(secondName,Bloggs),skipCount())'
    );
  });

  it('creates a query with two expressions in the contains', async () => {
    const containsStaff = rqlBuilder()
      .contains(
        'staff_enlistments',
        rqlBuilder().gt('id', '60').intermediate(),
        rqlBuilder().lt('id', '90').intermediate()
      )
      .build();

    expect(containsStaff).toBe(
      '?contains(staff_enlistments,and(gt(id,60),lt(id,90)))'
    );
  });

  it('creates a query with only the field in the contains', async () => {
    const containsStaff = rqlBuilder().contains('staff_enlistments').build();

    expect(containsStaff).toBe('?contains(staff_enlistments)');
  });

  it('creates a query with two expressions in the excludes', async () => {
    const excludesStaff = rqlBuilder()
      .excludes(
        'staff_enlistments',
        rqlBuilder().gt('id', '60').intermediate(),
        rqlBuilder().lt('id', '90').intermediate()
      )
      .build();

    expect(excludesStaff).toBe(
      '?excludes(staff_enlistments,and(gt(id,60),lt(id,90)))'
    );
  });

  it('creates a query with only the field in the excludes', async () => {
    const excludesStaff = rqlBuilder().excludes('staff_enlistments').build();

    expect(excludesStaff).toBe('?excludes(staff_enlistments)');
  });

  it('should parse a string to rqlString', async () => {
    const parsed = rqlParser('or(like(name,bi,tfit),eq(),like(name,fitbit))');

    expect(parsed).toBe('or(like(name,bi,tfit),eq(),like(name,fitbit))');
  });

  it('should throw an error on parsing invalid RQL to rqlString', async () => {
    expect(() => {
      rqlParser('or((like(name,btfit))');
    }).toThrowError();
  });

  it('should build a valid rql with a ISOstring', async () => {
    const timestamp = new Date(0).toISOString();
    const rql = rqlParser(`eq(timestamp,${timestamp})`);

    expect(rql).toBe('eq(timestamp,1970-01-01T00:00:00.000Z)');
  });

  it('should throw an error on parsing invalid ISOString in RQL to rqlString', async () => {
    const invalidTimestamp = '1970-21-01T00:00:00.000Z';

    expect(() => {
      rqlParser(`eq(timestamp,${invalidTimestamp})`);
    }).toThrowError();
  });

  it('Should double encode RQL values', () => {
    const value = '~> & Tester & <~';
    const encodedValue =
      '%257E%253E%2520%2526%2520Tester%2520%2526%2520%253C%257E';

    const rql = rqlBuilder().eq('name', value).build();
    expect(rql).toStrictEqual(`?eq(name,${encodedValue})`);
  });

  it('Should double encode nested RQL values', () => {
    const firstName = '~> Tester <~';
    const doubleEncodedFirstName = '%257E%253E%2520Tester%2520%253C%257E';

    const lastName = '<! McTestFace !>';
    const doubleEncodedLastName = '%253C%2521%2520McTestFace%2520%2521%253E';

    const firstCondition = rqlBuilder().eq('name', firstName).intermediate();
    const secondCondition = rqlBuilder()
      .eq('lastName', lastName)
      .intermediate();
    const rql = rqlBuilder().and(firstCondition, secondCondition).build();

    expect(rql).toStrictEqual(
      `?and(eq(name,${doubleEncodedFirstName}),eq(lastName,${doubleEncodedLastName}))`
    );
  });

  it('Should override the double encoding of RQL values when the global value is set to true', () => {
    const value = '~> & Tester & <~';
    const encodedValue =
      '%257E%253E%2520%2526%2520Tester%2520%2526%2520%253C%257E';

    const unencodedRql = rqlBuilder({ doubleEncode: false })
      .eq('name', value)
      .build();
    expect(unencodedRql).toStrictEqual(`?eq(name,${value})`);

    // When not providing the doubleEncodeValues argument the rql builder should use the global setting
    const encodedRql = rqlBuilder().eq('name', value).build();
    expect(encodedRql).toStrictEqual(`?eq(name,${encodedValue})`);
  });

  it('Should override the double encoding of RQL values when the global value is set to false', () => {
    rqlBuilder.doubleEncodeValues = false;

    const value = '~> & Tester & <~';
    const encodedValue =
      '%257E%253E%2520%2526%2520Tester%2520%2526%2520%253C%257E';

    const encodedRql = rqlBuilder({ doubleEncode: true })
      .eq('name', value)
      .build();
    expect(encodedRql).toStrictEqual(`?eq(name,${encodedValue})`);

    // When not providing the doubleEncodeValues argument the rql builder should use the global setting
    const unencodedRql = rqlBuilder().eq('name', value).build();
    expect(unencodedRql).toStrictEqual(`?eq(name,${value})`);

    // Reset the default global value
    rqlBuilder.doubleEncodeValues = true;
  });

  it('Should globally override the double encoding of RQL values', () => {
    rqlBuilder.doubleEncodeValues = false;

    const firstName = '~> Tester <~';
    const lastName = '<! McTestFace !>';

    // As the global setting is false the rql builder should not double encode the values
    const firstRql = rqlBuilder().in('firstNames', [firstName]).build();
    expect(firstRql).toStrictEqual(`?in(firstNames,${firstName})`);

    const secondRql = rqlBuilder().out('lastNames', [lastName]).build();
    expect(secondRql).toStrictEqual(`?out(lastNames,${lastName})`);

    // Reset the default global value
    rqlBuilder.doubleEncodeValues = true;
  });
});
