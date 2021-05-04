import nock from 'nock';
import { AUTH_BASE, DATA_BASE } from '../../../src/constants';
import { Client, client } from '../../../src/index';
import { ConfigurationType } from '../../../src/services/data/types';
import { newSchemaCreated } from '../../__helpers__/data';

describe('Properties Service', () => {
  const apiHost = 'https://api.xxx.fibricheck.com';
  const schemaId = newSchemaCreated.id;
  let sdk: Client;

  beforeAll(async () => {
    sdk = client({
      apiHost,
    });

    const mockToken = 'mockToken';
    nock(apiHost)
      .post(`${AUTH_BASE}/oauth2/token`)
      .reply(200, { access_token: mockToken });

    await sdk.auth.authenticate({
      clientId: '',
      username: '',
      password: '',
    });
  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it('Create a property', async () => {
    nock(`${apiHost}${DATA_BASE}`).post(`/${schemaId}/properties`).reply(200, {
      affectedRecords: 1,
    });
    const res = await sdk.data.createProperty(schemaId, {
      name: 'username',
      configuration: {
        type: ConfigurationType.STRING,
        minLength: 3,
        maxLength: 20,
      },
    });
    expect(res.affectedRecords).toBe(1);
  });

  it('Update a property', async () => {
    const propertyPath = 'username';
    nock(`${apiHost}${DATA_BASE}`)
      .put(`/${schemaId}/properties/${propertyPath}`)
      .reply(200, {
        affectedRecords: 1,
      });
    const res = await sdk.data.updateProperty(schemaId, propertyPath, {
      type: ConfigurationType.STRING,
      minLength: 3,
      maxLength: 20,
    });
    expect(res.affectedRecords).toBe(1);
  });

  it('Delete a property', async () => {
    const propertyPath = 'username';
    nock(`${apiHost}${DATA_BASE}`)
      .delete(`/${schemaId}/properties/${propertyPath}`)
      .reply(200, {
        affectedRecords: 1,
      });
    const res = await sdk.data.deleteProperty(schemaId, propertyPath);
    expect(res.affectedRecords).toBe(1);
  });
});
