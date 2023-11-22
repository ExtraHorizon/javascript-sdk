import { camelizeKeys, decamelizeKeys } from '../../src/http/utils';

describe('http/utils', () => {
  describe('camelizeKeys', () => {
    it('Camelizes all keys', () => {
      const obj = {
        my_id: 123,
        custom_props: {
          custom_prop_a: true,
          custom_prop_b: false,
        },
      };
      const result = camelizeKeys(obj, []);
      expect(result).toStrictEqual({
        myId: 123,
        customProps: {
          customPropA: true,
          customPropB: false,
        },
      });
    });

    it('Ignores Camelizing custom keys', () => {
      const obj = {
        my_id: 123,
        custom_props: {
          custom_prop_a: true,
          custom_prop_b: false,
        },
      };
      const result = camelizeKeys(obj, ['custom_props']);
      expect(result).toStrictEqual({
        myId: 123,
        customProps: {
          custom_prop_a: true,
          custom_prop_b: false,
        },
      });
    });

    it('Ignores Camelizing custom keys one level deep', () => {
      const obj = {
        my_id: 123,
        data: {
          custom_props: {
            custom_prop_a: true,
            custom_prop_b: false,
          },
        },
      };

      const result = camelizeKeys(obj, ['data.custom_props']);
      expect(result).toStrictEqual({
        myId: 123,
        data: {
          customProps: {
            custom_prop_a: true,
            custom_prop_b: false,
          },
        },
      });
    });

    it('Ignores Camelizing custom keys in an array', () => {
      const obj = {
        my_id: 123,
        data: [
          {
            custom_props: {
              custom_prop_a: true,
              custom_prop_b: false,
            },
          },
          {
            custom_props: {
              custom_prop_c: 'hello',
              custom_prop_d: 'world',
            },
          },
        ],
      };

      const result = camelizeKeys(obj, ['data.custom_props']);
      expect(result).toStrictEqual({
        myId: 123,
        data: [
          {
            customProps: {
              custom_prop_a: true,
              custom_prop_b: false,
            },
          },
          {
            customProps: {
              custom_prop_c: 'hello',
              custom_prop_d: 'world',
            },
          },
        ],
      });
    });

    it('Ignores camelizing all keys', () => {
      const obj = {
        my_id: 123,
        custom_props: {
          custom_prop_a: true,
          custom_prop_b: false,
        },
      };
      const result = camelizeKeys(obj, ['*']);
      expect(result).toStrictEqual({
        my_id: 123,
        custom_props: {
          custom_prop_a: true,
          custom_prop_b: false,
        },
      });
    });
  });

  describe('decamelizeKeys', () => {
    it('Decamelizes all keys', () => {
      const obj = {
        myId: 123,
        customProps: {
          customPropA: true,
          customPropB: false,
        },
      };
      const result = decamelizeKeys(obj, []);
      expect(result).toStrictEqual({
        my_id: 123,
        custom_props: {
          custom_prop_a: true,
          custom_prop_b: false,
        },
      });
    });

    it('Ignores Decamelizing custom keys', () => {
      const obj = {
        myId: 123,
        customProps: {
          customPropA: true,
          customPropB: false,
        },
      };
      const result = decamelizeKeys(obj, ['customProps']);
      expect(result).toStrictEqual({
        my_id: 123,
        custom_props: {
          customPropA: true,
          customPropB: false,
        },
      });
    });

    it('Ignores Decamelizing custom keys one level deep', () => {
      const obj = {
        myId: 123,
        data: {
          customProps: {
            customPropA: true,
            customPropB: false,
          },
        },
      };

      const result = decamelizeKeys(obj, ['data.customProps']);
      expect(result).toStrictEqual({
        my_id: 123,
        data: {
          custom_props: {
            customPropA: true,
            customPropB: false,
          },
        },
      });
    });

    it('Ignores Decamelizing custom keys in an array', () => {
      const obj = {
        myId: 123,
        data: [
          {
            customProps: {
              customPropA: true,
              customPropC: false,
            },
          },
          {
            customProps: {
              customPropC: 'hello',
              customPropD: 'world',
            },
          },
        ],
      };

      const result = decamelizeKeys(obj, ['data.customProps']);
      expect(result).toStrictEqual({
        my_id: 123,
        data: [
          {
            custom_props: {
              customPropA: true,
              customPropC: false,
            },
          },
          {
            custom_props: {
              customPropC: 'hello',
              customPropD: 'world',
            },
          },
        ],
      });
    });

    it('Ignores Decamelizing all keys', () => {
      const obj = {
        myId: 123,
        customProps: {
          customPropA: true,
          customPropB: false,
        },
      };

      const result = decamelizeKeys(obj, ['*']);
      expect(result).toStrictEqual({
        myId: 123,
        customProps: {
          customPropA: true,
          customPropB: false,
        },
      });
    });
  });
});
