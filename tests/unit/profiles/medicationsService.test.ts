import nock from 'nock';
import { AUTH_BASE, PROFILES_BASE } from '../../../src/constants';
import { Client, createClient, ParamsOauth2 } from '../../../src/index';
import {
  profileData,
  medicationData,
  medicationsResponse,
} from '../../__helpers__/profile';

describe('Medications Service', () => {
  const host = 'https://api.xxx.fibricheck.com';
  const profileId = profileData.id;
  const medicationName = medicationData.name;

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

  it('should retrieve a list of all the defined medications', async () => {
    nock(`${host}${PROFILES_BASE}`)
      .get('/medication')
      .reply(200, medicationsResponse);

    const res = await sdk.profiles.medications.getMedications();

    expect(res.data.length).toBeGreaterThan(0);
  });

  it('should add a new medicine to a specified profile', async () => {
    nock(`${host}${PROFILES_BASE}`)
      .post(`/${profileId}/medication`)
      .reply(200, medicationData);

    const medication = await sdk.profiles.medications.create(
      profileId,
      medicationData
    );

    expect(medication.name).toBe(medicationData.name);
  });

  it('should remove a medicine from a specified profile', async () => {
    nock(`${host}${PROFILES_BASE}`)
      .delete(`/${profileId}/medication/${medicationName}`)
      .reply(200, { affectedRecords: 1 });

    const res = await sdk.profiles.medications.remove(
      profileId,
      medicationName
    );

    expect(res.affectedRecords).toBe(1);
  });
});
