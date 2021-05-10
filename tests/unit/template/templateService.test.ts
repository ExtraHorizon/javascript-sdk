import nock from 'nock';
import { AUTH_BASE, TEMPLATE_BASE } from '../../../src/constants';
import { Client, client, rqlBuilder } from '../../../src/index';
import {
  templateData,
  templateResponse,
  templateInput,
} from '../../__helpers__/template';

describe('Template Service', () => {
  const apiHost = 'https://api.xxx.fibricheck.com';
  const templateId = templateData.id;

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

  it('Perform a health check', async () => {
    nock(`${apiHost}${TEMPLATE_BASE}`).get('/health').reply(200);

    const serviceIsAvailable = await sdk.template.health();

    expect(serviceIsAvailable).toBe(true);
  });

  it('Get all templates the service has to offer', async () => {
    const rql = rqlBuilder().build();
    nock(`${apiHost}${TEMPLATE_BASE}`)
      .get(`/${rql}`)
      .reply(200, templateResponse);

    const res = await sdk.template.find({ rql });

    expect(res.data.length).toBeGreaterThan(0);
  });

  it('Create a new template', async () => {
    nock(`${apiHost}${TEMPLATE_BASE}`).post('/').reply(200, templateData);

    const template = await sdk.template.createTemplate(templateInput);

    expect(template.name).toBe(templateData.name);
  });

  it('Update an existing template', async () => {
    nock(`${apiHost}${TEMPLATE_BASE}`)
      .put(`/${templateId}`)
      .reply(200, templateData);

    const template = await sdk.template.updateTemplate(
      templateId,
      templateInput
    );

    expect(template.name).toBe(templateData.name);
  });

  it('Delete a template', async () => {
    nock(`${apiHost}${TEMPLATE_BASE}`)
      .delete(`/${templateId}`)
      .reply(200, { affectedRecords: 1 });

    const res = await sdk.template.deleteTemplate(templateId);

    expect(res.affectedRecords).toBe(1);
  });

  it('Resolve a template as a pdf file', async () => {
    nock(`${apiHost}${TEMPLATE_BASE}`)
      .post(`/${templateId}/pdf`)
      .reply(200, 'string');

    const res = await sdk.template.resolveTemplateAsPdf(templateId, {
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

  it('Resolves a template with code as a pdf file', async () => {
    const localizationCode = 'EN';
    nock(`${apiHost}${TEMPLATE_BASE}`)
      .post(`/${templateId}/pdf/${localizationCode}`)
      .reply(200, 'string');

    const res = await sdk.template.resolveTemplateAsPdfUsingCode(
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

  it('Resolve a template as a json response', async () => {
    nock(`${apiHost}${TEMPLATE_BASE}`)
      .post(`/${templateId}/resolve`)
      .reply(200, {
        subject: 'Order for Doe',
        body: 'Hey, John',
      });

    const res = await sdk.template.resolveTemplateAsJson(templateId, {
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

  it('Resolve a template with code as a json response', async () => {
    const localizationCode = 'EN';
    nock(`${apiHost}${TEMPLATE_BASE}`)
      .post(`/${templateId}/resolve/${localizationCode}`)
      .reply(200, {
        subject: 'Order for Doe',
        body: 'Hey, John',
      });

    const res = await sdk.template.resolveTemplateAsJsonUsingCode(
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
