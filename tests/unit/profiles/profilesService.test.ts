import nock from 'nock';
import { AUTH_BASE, PROFILES_BASE } from '../../../src/constants';
import {
  Client,
  createClient,
  ParamsOauth2,
  rqlBuilder,
} from '../../../src/index';
import {
  profileData,
  profilesResponse,
  comorbiditiesResponse,
  impedimentsResponse,
} from '../../__helpers__/profile';

describe('Profiles Service', () => {
  const host = 'https://api.xxx.fibricheck.com';
  const profileId = profileData.id;

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

  it('should get a list of profiles', async () => {
    const rql = rqlBuilder().build();
    nock(`${host}${PROFILES_BASE}`).get('/').reply(200, profilesResponse);

    const res = await sdk.profiles.find({ rql });

    expect(res.data.length).toBeGreaterThan(0);
  });

  it('should find a profile by id', async () => {
    nock(`${host}${PROFILES_BASE}`)
      .get(`/?eq(id,${profileId})`)
      .reply(200, profilesResponse);

    const profile = await sdk.profiles.findById(profileId);

    expect(profile.id).toBe(profileId);
  });

  it('should find the first profile', async () => {
    nock(`${host}${PROFILES_BASE}`).get('/').reply(200, profilesResponse);

    const profile = await sdk.profiles.findFirst();

    expect(profile.id).toBe(profilesResponse.data[0].id);
  });

  it('should create a new profile', async () => {
    nock(`${host}${PROFILES_BASE}`).post('/').reply(200, profileData);

    const profile = await sdk.profiles.create({
      id: profileId,
      country: 'BE',
      birthday: '01/01/2000',
      region: 'string',
      gender: 1,
    });

    expect(profile.id).toBe(profileId);
  });

  it('should update a profile', async () => {
    const rql = rqlBuilder().build();
    nock(`${host}${PROFILES_BASE}`).put('/').reply(200, {
      affectedRecords: 1,
    });

    const res = await sdk.profiles.update(rql, profileData);

    expect(res.affectedRecords).toBe(1);
  });

  it('should remove a given field from all profile records', async () => {
    const rql = rqlBuilder().build();
    nock(`${host}${PROFILES_BASE}`).post('/remove_fields').reply(200, {
      affectedRecords: 1,
    });

    const res = await sdk.profiles.removeFields(rql, {
      fields: ['string'],
    });

    expect(res.affectedRecords).toBe(1);
  });

  it('should retrieve a list of all the defined comorbidities', async () => {
    nock(`${host}${PROFILES_BASE}`)
      .get('/comorbidities')
      .reply(200, comorbiditiesResponse);

    const res = await sdk.profiles.getComorbidities();

    expect(res.data.length).toBeGreaterThan(0);
  });

  it('should retrieve a list of all the defined impediments', async () => {
    nock(`${host}${PROFILES_BASE}`)
      .get('/impediments')
      .reply(200, impedimentsResponse);

    const res = await sdk.profiles.getImpediments();

    expect(res.data.length).toBeGreaterThan(0);
  });
});
