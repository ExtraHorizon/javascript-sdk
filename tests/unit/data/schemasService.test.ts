import nock from 'nock';
import { AUTH_BASE, DATA_BASE } from '../../../src/constants';
import {
  Client,
  createClient,
  ParamsOauth2,
  rqlBuilder,
} from '../../../src/index';
import {
  newSchemaInput,
  newSchemaCreated,
  schemaData,
} from '../../__helpers__/data';
import { createPagedResponse } from '../../__helpers__/utils';

describe('Schemas Service', () => {
  const schemasListResponse = createPagedResponse(schemaData);
  const schemaId = newSchemaCreated.id;
  const host = 'https://api.xxx.extrahorizon.io';
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

  it('Creates a schema', async () => {
    nock(`${host}${DATA_BASE}`).post('/').reply(200, newSchemaCreated);
    const schema = await sdk.data.schemas.create(newSchemaInput);
    expect(schema.creationTransition).toBeDefined();
  });

  it('Requests a list of schemas', async () => {
    nock(`${host}${DATA_BASE}`).get('/').reply(200, schemasListResponse);
    const res = await sdk.data.schemas.find();
    expect(res.data.length).toBeGreaterThan(0);
  });

  it('Requests a list of all schemas', async () => {
    nock(`${host}${DATA_BASE}`)
      .get('/?limit(50)')
      .reply(200, {
        page: {
          total: 65,
          offset: 0,
          limit: 50,
        },
        data: Array(50).fill(schemaData),
      })
      .get('/?limit(50,50)')
      .reply(200, {
        page: {
          total: 65,
          offset: 50,
          limit: 50,
        },
        data: Array(15).fill(schemaData),
      });
    const res = await sdk.data.schemas.findAll();
    expect(res).toHaveLength(65);
  });

  it('Finds a schema by id', async () => {
    nock(`${host}${DATA_BASE}`)
      .get(`/?eq(id,${schemaId})`)
      .reply(200, schemasListResponse);

    const schema = await sdk.data.schemas.findById(schemaId);

    expect(schema.id).toBe(schemaId);
  });

  it('Finds a schema by name', async () => {
    const { name } = schemaData;
    const rql = rqlBuilder().eq('name', name).build();

    nock(`${host}${DATA_BASE}`).get(`/${rql}`).reply(200, schemasListResponse);

    const schema = await sdk.data.schemas.findByName(name);

    expect(schema.name).toBe(name);
  });

  it('Finds the first schema', async () => {
    nock(`${host}${DATA_BASE}`).get('/').reply(200, schemasListResponse);

    const schema = await sdk.data.schemas.findFirst();

    expect(schema.id).toBe(schemaId);
  });

  it('Updates a schema', async () => {
    const newSchemaData = { name: 'schemaA', description: 'schema desc' };
    nock(`${host}${DATA_BASE}`).put(`/${schemaId}`).reply(200, {
      affectedRecords: 1,
    });
    const res = await sdk.data.schemas.update(schemaId, newSchemaData);
    expect(res.affectedRecords).toBe(1);
  });

  it('Deletes a schema', async () => {
    nock(`${host}${DATA_BASE}`).delete(`/${schemaId}`).reply(200, {
      affectedRecords: 1,
    });
    const res = await sdk.data.schemas.remove(schemaId);
    expect(res.affectedRecords).toBe(1);
  });

  it('Disables a schema', async () => {
    nock(`${host}${DATA_BASE}`).post(`/${schemaId}/disable`).reply(200, {
      affectedRecords: 1,
    });
    const res = await sdk.data.schemas.disable(schemaId);
    expect(res.affectedRecords).toBe(1);
  });

  it('Enables a schema', async () => {
    nock(`${host}${DATA_BASE}`).post(`/${schemaId}/enable`).reply(200, {
      affectedRecords: 1,
    });
    const res = await sdk.data.schemas.enable(schemaId);
    expect(res.affectedRecords).toBe(1);
  });

  it('Finds a transitionId by name given a schema', async () => {
    nock(`${host}${DATA_BASE}`).get('/').reply(200, schemasListResponse);
    const {
      data: [schema],
    } = await sdk.data.schemas.find();
    const transitionId = schema.findTransitionIdByName('move');
    expect(transitionId).toBe('5e9fff9d84820a2a9a718e2f');
  });

  it('Gets a transition by name given a schema', async () => {
    nock(`${host}${DATA_BASE}`).get('/').reply(200, schemasListResponse);
    const {
      data: [schema],
    } = await sdk.data.schemas.find();
    const transition = schema.transitionsByName.move;
    expect(transition.id).toBe('5e9fff9d84820a2a9a718e2f');
  });

  it('Requests a list of all schemas via iterator', async () => {
    nock(`${host}${DATA_BASE}`)
      .get('/?limit(50)')
      .reply(200, {
        page: {
          total: 55,
          offset: 0,
          limit: 50,
        },
        data: Array(50).fill(schemaData),
      })
      .get('/?limit(50,50)')
      .reply(200, {
        page: {
          total: 55,
          offset: 50,
          limit: 50,
        },
        data: Array(5).fill(schemaData),
      });
    const schemas = sdk.data.schemas.findAllIterator();

    await schemas.next();
    const thirdPage = await schemas.next();
    expect(thirdPage.value.data).toHaveLength(5);
  });

  it('Requests a list of all schemas with offset and throw error', async () => {
    expect.assertions(1);
    try {
      nock(`${host}${DATA_BASE}`)
        .get('/?limit(50)')
        .reply(200, schemasListResponse);
      await sdk.data.schemas.findAll({
        rql: rqlBuilder().limit(20, 20).build(),
      });
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it('Requests a list of schemas and use next / previous', async () => {
    nock(`${host}${DATA_BASE}`)
      .get('/')
      .reply(200, {
        page: {
          total: 45,
          offset: 0,
          limit: 20,
        },
        data: Array(20).fill(schemaData),
      })
      .get('/?limit(20,20)')
      .reply(200, {
        page: {
          total: 45,
          offset: 20,
          limit: 20,
        },
        data: Array(20).fill(schemaData),
      })
      .get('/?limit(20,40)')
      .reply(200, {
        page: {
          total: 45,
          offset: 40,
          limit: 20,
        },
        data: Array(5).fill(schemaData),
      })
      .get('/?limit(20,20)')
      .reply(200, {
        page: {
          total: 45,
          offset: 0,
          limit: 20,
        },
        data: Array(20).fill(schemaData),
      });
    const schemas = await sdk.data.schemas.find();

    const secondPage = await schemas.next();
    const thirdPage = await schemas.next();
    const previousPage = await schemas.previous();
    expect(secondPage.data).toHaveLength(20);
    expect(thirdPage.data).toHaveLength(5);
    expect(previousPage.data).toHaveLength(20);
  });
});
