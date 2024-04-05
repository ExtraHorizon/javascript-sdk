import nock from 'nock';
import { AUTH_BASE, PROFILES_BASE } from '../../../src/constants';
import {
  Client,
  createClient,
  ParamsOauth2,
  rqlBuilder,
  Comorbidities,
  Impediments,
} from '../../../src/index';
import { profileData } from '../../__helpers__/profile';
import { createPagedResponse } from '../../__helpers__/utils';

describe('Profiles Service', () => {
  const host = 'https://api.xxx.extrahorizon.io';
  const profileId = profileData.id;
  const profilesResponse = createPagedResponse(profileData);

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

  it('should not convert the custom fields to camel case', async () => {
    const profile = {
      id: profileId,
      custom_fields: {
        hello_world: 'log hello world',
        property_1: 'jeej!',
      },
    };

    const rql = rqlBuilder().build();
    nock(`${host}${PROFILES_BASE}`)
      .get('/')
      .reply(200, createPagedResponse(profile));

    const res = await sdk.profiles.find({ rql });

    expect(res.data[0].customFields).toStrictEqual(profile.custom_fields);
  });

  it('should convert the custom fields to camel case if normalizeCustomData is true on the request', async () => {
    const profile = {
      id: profileId,
      custom_fields: {
        hello_world: 'log hello world',
        property_1: 'jeej!',
      },
    };

    const rql = rqlBuilder().build();
    nock(`${host}${PROFILES_BASE}`)
      .get('/')
      .reply(200, createPagedResponse(profile));

    const res = await sdk.profiles.find({
      rql,
      normalizeCustomData: true,
    });

    expect(res.data[0].customFields).toStrictEqual({
      helloWorld: 'log hello world',
      property1: 'jeej!',
    });
  });

  it('should convert the custom fields to camel case if the normalizeCustomData is true on the client', async () => {
    sdk = createClient({
      host,
      clientId: '',
      normalizeCustomData: true,
    });

    const mockToken = 'mockToken';
    nock(host)
      .post(`${AUTH_BASE}/oauth2/tokens`)
      .reply(200, { access_token: mockToken });

    await sdk.auth.authenticate({
      username: '',
      password: '',
    });

    const profile = {
      id: profileId,
      custom_fields: {
        hello_world: 'log hello world',
        property_1: 'jeej!',
      },
    };

    const rql = rqlBuilder().build();
    nock(`${host}${PROFILES_BASE}`)
      .get('/')
      .reply(200, createPagedResponse(profile));

    const res = await sdk.profiles.find({ rql });

    expect(res.data[0].customFields).toStrictEqual({
      helloWorld: 'log hello world',
      property1: 'jeej!',
    });
  });

  it('should not convert the custom fields to camel case if the normalizeCustomData true on the client but set to false on the request', async () => {
    sdk = createClient({
      host,
      clientId: '',
      normalizeCustomData: true,
    });

    const mockToken = 'mockToken';
    nock(host)
      .post(`${AUTH_BASE}/oauth2/tokens`)
      .reply(200, { access_token: mockToken });

    await sdk.auth.authenticate({
      username: '',
      password: '',
    });

    const profile = {
      id: profileId,
      custom_fields: {
        hello_world: 'log hello world',
        property_1: 'jeej!',
      },
    };

    const rql = rqlBuilder().build();
    nock(`${host}${PROFILES_BASE}`)
      .get('/')
      .reply(200, createPagedResponse(profile));

    const res = await sdk.profiles.find({
      rql,
      normalizeCustomData: false,
    });

    expect(res.data[0].customFields).toStrictEqual(profile.custom_fields);
  });

  it('should request a list of all profiles', async () => {
    nock(`${host}${PROFILES_BASE}`)
      .get('/?limit(50)')
      .reply(200, {
        page: {
          total: 65,
          offset: 0,
          limit: 50,
        },
        data: Array(50).fill(profileData),
      })
      .get('/?limit(50,50)')
      .reply(200, {
        page: {
          total: 65,
          offset: 50,
          limit: 50,
        },
        data: Array(15).fill(profileData),
      });
    const res = await sdk.profiles.findAll();
    expect(res.length).toBe(65);
  });

  it('should request a list of all profiles via iterator', async () => {
    nock(`${host}${PROFILES_BASE}`)
      .get('/?limit(50)')
      .reply(200, {
        page: {
          total: 55,
          offset: 0,
          limit: 50,
        },
        data: Array(50).fill(profileData),
      })
      .get('/?limit(50,50)')
      .reply(200, {
        page: {
          total: 55,
          offset: 50,
          limit: 50,
        },
        data: Array(5).fill(profileData),
      });
    const profiles = sdk.profiles.findAllIterator();

    await profiles.next();
    const thirdPage = await profiles.next();
    expect(thirdPage.value.data.length).toBe(5);
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
      .reply(200, createPagedResponse(Comorbidities.HEART_FAILURE));

    const res = await sdk.profiles.getComorbidities();

    expect(res.data.length).toBeGreaterThan(0);
  });

  it('should retrieve a list of all the defined impediments', async () => {
    nock(`${host}${PROFILES_BASE}`)
      .get('/impediments')
      .reply(200, createPagedResponse(Impediments.TREMOR));

    const res = await sdk.profiles.getImpediments();

    expect(res.data.length).toBeGreaterThan(0);
  });
});
