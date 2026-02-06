import nock from 'nock';
import { createClient, rqlBuilder } from '../../../src';
import { TEMPLATES_V2_BASE } from '../../../src/constants';
import { generateTemplateOutput, generateTemplateInput } from '../../__helpers__/templateV2';
import { createPagedResponse, randomHexString } from '../../__helpers__/utils';

describe('TemplatesV2 Service', () => {
  const host = 'https://api.xxx.extrahorizon.io';
  const sdk = createClient({
    host,
    clientId: '',
  });

  const templates = Array(250)
    .fill(null)
    .map(_ => generateTemplateOutput());

  it('Creates a template', async () => {
    const templateId = randomHexString();
    const template = generateTemplateInput();

    nock(`${host}${TEMPLATES_V2_BASE}`)
      .post('/')
      .reply(200, { id: templateId, ...template });

    const response = await sdk.templatesV2.create(template);
    expect(response.id).toBe(templateId);
  });

  it('Updates a template', async () => {
    const templateId = randomHexString();
    const updateData = { description: randomHexString() };

    nock(`${host}${TEMPLATES_V2_BASE}`)
      .put(`/${templateId}`)
      .reply(200, { affectedRecords: 1 });

    const response = await sdk.templatesV2.update(templateId, updateData);
    expect(response.affectedRecords).toBe(1);
  });

  it('Deletes a template', async () => {
    const templateId = randomHexString();

    nock(`${host}${TEMPLATES_V2_BASE}`)
      .delete(`/${templateId}`)
      .reply(200, { affectedRecords: 1 });

    const response = await sdk.templatesV2.remove(templateId);
    expect(response.affectedRecords).toBe(1);
  });

  it('Resolves a template', async () => {
    const templateId = randomHexString();

    nock(`${host}${TEMPLATES_V2_BASE}`)
      .post(`/${templateId}/resolve`)
      .reply(200, { subject: 'hello' });

    const response = await sdk.templatesV2.resolve(templateId, {});
    expect(response.subject).toBe('hello');
  });

  it('Finds template', async () => {
    nock(`${host}${TEMPLATES_V2_BASE}`)
      .get('/?limit(250)')
      .reply(200, createPagedResponse(templates));

    // Prove that we accept RQL
    const rql = rqlBuilder().limit(250).build();

    const response = await sdk.templatesV2.find({ rql });
    expect(response.page.total).toBe(250);
  });

  it('Finds all templates', async () => {
    const firstTemplatesPage = templates.slice(0, 50);
    const secondTemplatesPage = templates.slice(50, 100);

    nock(`${host}${TEMPLATES_V2_BASE}`)
      .get('/?limit(50)')
      .reply(
        200,
        {
          page: {
            total: 100,
            offset: 0,
            limit: 50,
          },
          data: firstTemplatesPage,
        }
      )
      .get('/?limit(50,50)')
      .reply(
        200,
        {
          page: {
            total: 100,
            offset: 50,
            limit: 50,
          },
          data: secondTemplatesPage,
        }
      );

    const response = await sdk.templatesV2.findAll();
    expect(response).toHaveLength(100);
  });

  it('Finds a template by name', async () => {
    const template = templates[69];
    const { name } = template;

    nock(`${host}${TEMPLATES_V2_BASE}`)
      .get(`/?eq(name,${name})`)
      .reply(200, { data: templates.filter(t => t.name === name) });

    const response = await sdk.templatesV2.findByName(name);
    expect(response).toStrictEqual(template);
  });

  it('Finds the first template', async () => {
    nock(`${host}${TEMPLATES_V2_BASE}`)
      .get('/')
      .reply(200, createPagedResponse(templates));

    const response = await sdk.templatesV2.findFirst();
    expect(response?.id).toBe(templates[0].id);
  });

  it('Finds a template by id', async () => {
    const { id } = templates[100];

    nock(`${host}${TEMPLATES_V2_BASE}`)
      .get(`/?eq(id,${id})`)
      .reply(200, createPagedResponse(templates.filter(template => template.id === id)));

    const response = await sdk.templatesV2.findById(id);
    expect(response?.id).toBe(id);
  });
});
