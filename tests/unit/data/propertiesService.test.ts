import nock from 'nock';
import { AUTH_BASE, DATA_BASE } from '../../../src/constants';
import { Client, createClient, ParamsOauth2 } from '../../../src/index';
import { newSchemaCreated } from '../../__helpers__/data';

describe('Properties Service', () => {
  const host = 'https://api.xxx.fibricheck.com';
  const schemaId = newSchemaCreated.id;
  let sdk: Client<ParamsOauth2>;

  beforeAll(async () => {
    sdk = createClient({
      host,
      clientId: '',
    });

    const mockToken = 'mockToken';
    nock(host)
      .post(`${AUTH_BASE}/oauth2/tokens`)
      .reply(200, { access_token: mockToken });

    await sdk.auth.authenticate({
      username: '',
      password: '',
    });
  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it('should create a property', async () => {
    nock(`${host}${DATA_BASE}`).post(`/${schemaId}/properties`).reply(200, {
      affectedRecords: 1,
    });
    const res = await sdk.data.properties.create(schemaId, {
      name: 'username',
      configuration: {
        type: 'string',
        minLength: 3,
        maxLength: 20,
      },
    });
    expect(res.affectedRecords).toBe(1);
  });

  it('should update a property', async () => {
    const propertyPath = 'username';
    nock(`${host}${DATA_BASE}`)
      .put(`/${schemaId}/properties/${propertyPath}`)
      .reply(200, {
        affectedRecords: 1,
      });
    const res = await sdk.data.properties.update(schemaId, propertyPath, {
      type: 'string',
      minLength: 3,
      maxLength: 20,
    });
    expect(res.affectedRecords).toBe(1);
  });

  it('should delete a property', async () => {
    const propertyPath = 'username';
    nock(`${host}${DATA_BASE}`)
      .delete(`/${schemaId}/properties/${propertyPath}`)
      .reply(200, {
        affectedRecords: 1,
      });
    const res = await sdk.data.properties.delete(schemaId, propertyPath);
    expect(res.affectedRecords).toBe(1);
  });
});
