import { recursiveMap } from './utils';

describe('recursiveMap', () => {
  it('simple object mapEntriesRecursive', () => {
    const result = recursiveMap(value => `-> ${value}`)({
      test: 'value',
    });

    expect(result.test).toBe('-> value');
  });

  it('complex object', () => {
    const result = recursiveMap((value, key) => {
      if (key.includes('stamp')) {
        return new Date(value).toISOString();
      }
      return value;
    })({
      id: '5bfbfc3146e0fb321rsa4b28',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      activation: true,
      phone_number: 9021324354,
      profile_image: 'string',
      language: 'NL',
      time_zone: 'Europe/Brussels',
      subObject: { expiry_timestamp: 1543240753289 },
      patient_enlistments: [
        {
          group_id: '5bfbfc3146e0fb321rsa4b28',
          expiry_timestamp: 1543240753289,
          expired: true,
          creation_timestamp: 1543240753200,
        },
      ],
    });
    expect(result.patient_enlistments[0].expiry_timestamp).toBe(
      '2018-11-26T13:59:13.289Z'
    );
  });
});
