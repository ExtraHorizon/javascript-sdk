import nock from 'nock';
import { AUTH_BASE, TEMPLATE_BASE } from '../../../src/constants';
import {
  Client,
  createClient,
  rqlBuilder,
  ParamsOauth2,
} from '../../../src/index';
import { templateData, templateInput } from '../../__helpers__/template';
import { createPagedResponse } from '../../__helpers__/utils';

describe('Template Service', () => {
  const host = 'https://api.xxx.fibricheck.com';
  const templateId = templateData.id;
  const templateResponse = createPagedResponse(templateData);

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

  it('should perform a health check', async () => {
    nock(`${host}${TEMPLATE_BASE}`).get('/health').reply(200);

    const serviceIsAvailable = await sdk.templates.health();

    expect(serviceIsAvailable).toBe(true);
  });

  it('should get all templates the service has to offer', async () => {
    const rql = rqlBuilder().build();
    nock(`${host}${TEMPLATE_BASE}`).get(`/${rql}`).reply(200, templateResponse);

    const res = await sdk.templates.find({ rql });

    expect(res.data.length).toBeGreaterThan(0);
  });

  it('should find a template by id', async () => {
    nock(`${host}${TEMPLATE_BASE}`)
      .get(`/?eq(id,${templateId})`)
      .reply(200, templateResponse);

    const template = await sdk.templates.findById(templateId);

    expect(template.id).toBe(templateId);
  });

  it('should find a template by name', async () => {
    const { name } = templateData;
    nock(`${host}${TEMPLATE_BASE}`)
      .get(`/?eq(name,${name})`)
      .reply(200, templateResponse);

    const template = await sdk.templates.findByName(name);

    expect(template.name).toBe(name);
  });

  it('should find the first template', async () => {
    nock(`${host}${TEMPLATE_BASE}`).get('/').reply(200, templateResponse);

    const template = await sdk.templates.findFirst();

    expect(template.id).toBe(templateId);
  });

  it('should create a new template', async () => {
    nock(`${host}${TEMPLATE_BASE}`).post('/').reply(200, templateData);

    const template = await sdk.templates.create(templateInput);

    expect(template.name).toBe(templateData.name);
  });

  it('should update an existing template', async () => {
    nock(`${host}${TEMPLATE_BASE}`)
      .put(`/${templateId}`)
      .reply(200, templateData);

    const template = await sdk.templates.update(templateId, templateInput);

    expect(template.name).toBe(templateData.name);
  });

  it('should delete a template', async () => {
    nock(`${host}${TEMPLATE_BASE}`)
      .delete(`/${templateId}`)
      .reply(200, { affectedRecords: 1 });

    const res = await sdk.templates.remove(templateId);

    expect(res.affectedRecords).toBe(1);
  });

  it('should resolve a template as a pdf file', async () => {
    nock(`${host}${TEMPLATE_BASE}`)
      .post(`/${templateId}/pdf`)
      .reply(200, 'string');

    const res = await sdk.templates.resolveAsPdf(templateId, {
      language: 'NL',
      timeZone: 'Europe/Brussels',
      content: {
        shippinginfo: {
          firstname: 'John',
          lastname: 'Doe',
        },
      },
    });

    expect(res).toBeDefined();
  });

  it('should resolve a template with code as a pdf file', async () => {
    const localizationCode = 'EN';
    nock(`${host}${TEMPLATE_BASE}`)
      .post(`/${templateId}/pdf/${localizationCode}`)
      .reply(200, 'string');

    const res = await sdk.templates.resolveAsPdfUsingCode(
      templateId,
      localizationCode,
      {
        language: 'NL',
        timeZone: 'Europe/Brussels',
        content: {
          shippinginfo: {
            firstname: 'John',
            lastname: 'Doe',
          },
        },
      }
    );

    expect(res).toBeDefined();
  });

  it('should resolve a template as a json response', async () => {
    nock(`${host}${TEMPLATE_BASE}`).post(`/${templateId}/resolve`).reply(200, {
      subject: 'Order for Doe',
      body: 'Hey, John',
    });

    const res = await sdk.templates.resolveAsJson(templateId, {
      language: 'NL',
      timeZone: 'Europe/Brussels',
      content: {
        shippinginfo: {
          firstname: 'John',
          lastname: 'Doe',
        },
      },
    });

    expect(res).toBeDefined();
  });

  it('should resolve a template with code as a json response', async () => {
    const localizationCode = 'EN';
    nock(`${host}${TEMPLATE_BASE}`)
      .post(`/${templateId}/resolve/${localizationCode}`)
      .reply(200, {
        subject: 'Order for Doe',
        body: 'Hey, John',
      });

    const res = await sdk.templates.resolveAsJsonUsingCode(
      templateId,
      localizationCode,
      {
        language: 'NL',
        timeZone: 'Europe/Brussels',
        content: {
          shippinginfo: {
            firstname: 'John',
            lastname: 'Doe',
          },
        },
      }
    );

    expect(res).toBeDefined();
  });
});
