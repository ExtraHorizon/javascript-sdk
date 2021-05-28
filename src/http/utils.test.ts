import {
  camelize,
  camelizeKeys,
  decamelize,
  decamelizeKeys,
  recursiveMap,
  recursiveRenameKeys,
} from './utils';

describe('recursiveMap function', () => {
  it('should recursively map with simple object', () => {
    const result = recursiveMap(value => `-> ${value}`)({
      test: 'value',
    });

    expect(result.test).toBe('-> value');
  });

  it('should recursively map with object with arrays', () => {
    const result = recursiveMap((value, key) => {
      if (key.includes('stamp')) {
        return new Date(value);
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
    expect(result.patient_enlistments[0].expiry_timestamp).toStrictEqual(
      new Date('2018-11-26T13:59:13.289Z')
    );
  });

  it('should recursively map an array containing object with arrays', () => {
    const result = recursiveMap((value, key) => {
      if (key.includes('stamp')) {
        return new Date(value).toISOString();
      }
      return value;
    })([
      {
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
      },
    ]);
    expect(Array.isArray(result)).toEqual(true);
    expect(result[0].patient_enlistments[0].expiry_timestamp).toBe(
      '2018-11-26T13:59:13.289Z'
    );
  });
});

describe('recursiveRenameKeys function', () => {
  it('should map keys for simple object', () => {
    const result = recursiveRenameKeys(value => `test_${value}`, {
      test: 'value',
    });

    expect(Object.keys(result)).toStrictEqual(['test_test']);
  });

  it('should map keys recursively for object containing array', () => {
    const result = recursiveRenameKeys(
      key => {
        if (key === 'phone_number') {
          return 'phone';
        }
        if (key === 'subObject') {
          return 'objectSub';
        }
        if (key === 'patient_enlistments') {
          return 'patientEnlistments';
        }
        if (key === 'expiry_timestamp') {
          return 'expiry_ts';
        }
        return key;
      },
      {
        id: '5bfbfc3146e0fb321rsa4b28',
        phone_number: 9021324354,
        subObject: { expiry_timestamp: 1543240753289 },
        patient_enlistments: [
          {
            group_id: '5bfbfc3146e0fb321rsa4b28',
            expiry_timestamp: 1543240753289,
            expired: true,
            creation_timestamp: 1543240753200,
          },
        ],
      }
    );
    expect(result.patientEnlistments[0].expiry_ts).toBe(1543240753289);
  });

  it('should map keys recursively for an array containing objects with arrays', () => {
    const result = recursiveRenameKeys(
      key => {
        if (key === 'phone_number') {
          return 'phone';
        }
        if (key === 'subObject') {
          return 'objectSub';
        }
        if (key === 'patient_enlistments') {
          return 'patientEnlistments';
        }
        if (key === 'expiry_timestamp') {
          return 'expiry_ts';
        }
        return key;
      },
      [
        {
          id: '5bfbfc3146e0fb321rsa4b28',
          phone_number: 9021324354,
          subObject: { expiry_timestamp: 1543240753289 },
          patient_enlistments: [
            {
              group_id: '5bfbfc3146e0fb321rsa4b28',
              expiry_timestamp: 1543240753289,
              expired: true,
              creation_timestamp: 1543240753200,
            },
          ],
        },
      ]
    );
    expect(result[0].patientEnlistments[0].expiry_ts).toBe(1543240753289);
  });
});

describe('camelize function', () => {
  it('should camelize a string', () => {
    const result = camelize('easy_string_to_test');
    expect(result).toBe('easyStringToTest');
  });
});

describe('camelizeKeys function', () => {
  it('should camelize keys of an object', () => {
    const result = camelizeKeys({
      easy_string_to_test: 'test',
    });
    expect(result.easyStringToTest).toBeDefined();
  });
});

describe('decamelize function', () => {
  it('should decamlize a string', () => {
    const result = decamelize('easyStringTo_test');
    expect(result).toBe('easy_string_to_test');
  });
});

describe('decamelizeKeys function', () => {
  it('should decamelize keys of an object', () => {
    const result = decamelizeKeys({
      easyStringTo_test: 'test',
    });
    expect(result.easy_string_to_test).toBeDefined();
  });
});
