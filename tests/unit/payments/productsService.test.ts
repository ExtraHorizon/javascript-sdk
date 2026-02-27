import nock from 'nock';
import { AUTH_BASE, PAYMENTS_BASE } from '../../../src/constants';
import {
  Client,
  createClient,
  ParamsOauth2,
  rqlBuilder,
} from '../../../src/index';
import { newProductData, productData } from '../../__helpers__/payment';
import { createPagedResponse } from '../../__helpers__/utils';

describe('Products Service', () => {
  const host = 'https://api.xxx.extrahorizon.io';
  const productId = productData.id;
  const productResponse = createPagedResponse(productData);

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

  it('Creates a product', async () => {
    nock(`${host}${PAYMENTS_BASE}`).post('/products').reply(200, productData);

    const productSchema = await sdk.payments.products.create(newProductData);

    expect(productSchema.id).toBe(productId);
  });

  it('Gets a list of products', async () => {
    const rql = rqlBuilder().build();
    nock(`${host}${PAYMENTS_BASE}`)
      .get('/products')
      .reply(200, productResponse);

    const res = await sdk.payments.products.find({ rql });

    expect(res.data.length).toBeGreaterThan(0);
  });

  it('Finds a product by id', async () => {
    nock(`${host}${PAYMENTS_BASE}`)
      .get(`/products?eq(id,${productId})`)
      .reply(200, productResponse);

    const product = await sdk.payments.products.findById(productId);

    expect(product.id).toBe(productId);
  });

  it('Finds the first product', async () => {
    nock(`${host}${PAYMENTS_BASE}`)
      .get('/products')
      .reply(200, productResponse);

    const product = await sdk.payments.products.findFirst();

    expect(product.id).toBe(productResponse.data[0].id);
  });

  it('Adds tags to a product', async () => {
    const rql = rqlBuilder().build();
    nock(`${host}${PAYMENTS_BASE}`).post('/products/addTags').reply(200, {
      affectedRecords: 1,
    });

    const res = await sdk.payments.products.addTagsToProduct(rql, {
      tags: ['tags1'],
    });

    expect(res.affectedRecords).toBe(1);
  });

  it('Removes tags to a product', async () => {
    const rql = rqlBuilder().build();
    nock(`${host}${PAYMENTS_BASE}`).post('/products/removeTags').reply(200, {
      affectedRecords: 1,
    });

    const res = await sdk.payments.products.removeTagsFromProduct(rql, {
      tags: ['tags1'],
    });

    expect(res.affectedRecords).toBe(1);
  });

  it('Updates a product', async () => {
    nock(`${host}${PAYMENTS_BASE}`).put(`/products/${productId}`).reply(200, {
      affectedRecords: 1,
    });

    const res = await sdk.payments.products.update(productId, productData);

    expect(res.affectedRecords).toBe(1);
  });

  it('Deletes a product', async () => {
    nock(`${host}${PAYMENTS_BASE}`)
      .delete(`/products/${productId}`)
      .reply(200, {
        affectedRecords: 1,
      });

    const res = await sdk.payments.products.remove(productId);

    expect(res.affectedRecords).toBe(1);
  });
});
