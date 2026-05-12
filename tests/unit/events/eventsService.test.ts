import nock from 'nock';
import { AUTH_BASE, EVENTS_BASE } from '../../../src/constants';
import {
  Client,
  createClient,
  rqlBuilder,
  ParamsOauth2,
} from '../../../src/index';
import { eventInput, eventData } from '../../__helpers__/event';
import { createPagedResponse } from '../../__helpers__/utils';

describe('Events Service', () => {
  const host = 'https://api.xxx.extrahorizon.io';
  const eventId = eventData.id;
  const eventsResponse = createPagedResponse(eventData);

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

  it('Gets a list of events', async () => {
    const rql = rqlBuilder().build();
    nock(`${host}${EVENTS_BASE}`).get(`/${rql}`).reply(200, eventsResponse);

    const res = await sdk.events.find({ rql });

    expect(res.data.length).toBeGreaterThan(0);
  });

  it('Finds an event by id', async () => {
    nock(`${host}${EVENTS_BASE}`)
      .get(`/?eq(id,${eventId})`)
      .reply(200, eventsResponse);

    const event = await sdk.events.findById(eventId);

    expect(event?.id).toBe(eventId);
  });

  it('Finds the first event', async () => {
    nock(`${host}${EVENTS_BASE}`).get('/').reply(200, eventsResponse);

    const event = await sdk.events.findFirst();

    expect(event?.id).toBe(eventId);
  });

  it('Finds all events', async () => {
    nock(`${host}${EVENTS_BASE}`)
      .get('/?limit(50)')
      .reply(200, createPagedResponse([eventData], { total: 2, offset: 0, limit: 1 }));

    nock(`${host}${EVENTS_BASE}`)
      .get('/?limit(1,1)')
      .reply(200, createPagedResponse([eventData], { total: 2, offset: 1, limit: 1 }));

    const events = await sdk.events.findAll();

    expect(events).toStrictEqual([eventData, eventData]);
  });

  describe('create()', () => {
    it('Creates an event', async () => {
      nock(`${host}${EVENTS_BASE}`).post('/').reply(200, eventData);

      const event = await sdk.events.create(eventInput);

      expect(event.id).toBe(eventData.id);
    });

    // WARNING: This is currently used by at least FC, we should not break it
    it('Creates an event and allows to send camelCased content by setting "customRequestKeys"', async () => {
      const data = {
        type: 'MY_EVENT',
        content: {
          camelKey: 'value',
        },
      };

      nock(`${host}${EVENTS_BASE}`)
        .post('/', data)
        .reply(200, eventData);

      const event = await sdk.events.create(data, { customRequestKeys: ['content'] } as any);

      expect(event.id).toBe(eventData.id);
    });

    it('Creates an event and allows to send camelCased content by disabling "normalizeEventContent"', async () => {
      const data = {
        type: 'MY_EVENT',
        content: {
          camelKey: 'value',
        },
      };

      nock(`${host}${EVENTS_BASE}`)
        .post('/', data)
        .reply(200, eventData);

      const event = await sdk.events.create(data, { normalizeEventContent: false });

      expect(event.id).toBe(eventData.id);
    });
  });

  it('Performs a health check', async () => {
    nock(`${host}${EVENTS_BASE}`).get('/health').reply(200);
    const serviceIsAvailable = await sdk.events.health();
    expect(serviceIsAvailable).toBe(true);
  });
});
