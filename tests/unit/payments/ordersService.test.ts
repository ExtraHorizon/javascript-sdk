import nock from 'nock';
import { AUTH_BASE, PAYMENTS_BASE } from '../../../src/constants';
import {
  Client,
  createClient,
  ParamsOauth2,
  rqlBuilder,
} from '../../../src/index';
import { orderData, newOrder } from '../../__helpers__/payment';
import { createPagedResponse } from '../../__helpers__/utils';

describe('Orders Service', () => {
  const host = 'https://api.xxx.extrahorizon.io';
  const orderId = orderData.id;
  const orderResponse = createPagedResponse(orderData);

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

  it('should get a list of orders', async () => {
    const rql = rqlBuilder().build();
    nock(`${host}${PAYMENTS_BASE}`).get('/orders').reply(200, orderResponse);

    const res = await sdk.payments.orders.find({ rql });

    expect(res.data.length).toBeGreaterThan(0);
  });

  it('should find an order by id', async () => {
    nock(`${host}${PAYMENTS_BASE}`)
      .get(`/orders?eq(id,${orderId})`)
      .reply(200, orderResponse);

    const order = await sdk.payments.orders.findById(orderId);

    expect(order.id).toBe(orderId);
  });

  it('should find the first order', async () => {
    nock(`${host}${PAYMENTS_BASE}`).get('/orders').reply(200, orderResponse);

    const order = await sdk.payments.orders.findFirst();

    expect(order.id).toBe(orderResponse.data[0].id);
  });

  it('should create an order', async () => {
    nock(`${host}${PAYMENTS_BASE}`).post('/orders').reply(200, orderData);

    const order = await sdk.payments.orders.create(newOrder);

    expect(order.id).toBe(orderId);
  });

  it('should update the status of an order', async () => {
    nock(`${host}${PAYMENTS_BASE}`).put(`/orders/${orderId}`).reply(200, {
      affectedRecords: 1,
    });

    const res = await sdk.payments.orders.update(orderId, {
      status: 'completed',
    });

    expect(res.affectedRecords).toBe(1);
  });

  it('should add tags to an order', async () => {
    const rql = rqlBuilder().build();
    nock(`${host}${PAYMENTS_BASE}`).post('/orders/addTags').reply(200, {
      affectedRecords: 1,
    });

    const res = await sdk.payments.orders.addTagsToOrder(rql, {
      tags: ['tags1'],
    });

    expect(res.affectedRecords).toBe(1);
  });

  it('should remove tags from an order', async () => {
    const rql = rqlBuilder().build();
    nock(`${host}${PAYMENTS_BASE}`).post('/orders/removeTags').reply(200, {
      affectedRecords: 1,
    });

    const res = await sdk.payments.orders.removeTagsFromOrder(rql, {
      tags: ['tags1'],
    });

    expect(res.affectedRecords).toBe(1);
  });
});
