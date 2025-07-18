import nock from 'nock';
import {AUTH_BASE, PAYMENTS_BASE} from '../../../src/constants';
import {createOAuth2Client, OAuth2Client, rqlBuilder,} from '../../../src/index';
import {newProductData, productData} from '../../__helpers__/payment';
import {createPagedResponse} from '../../__helpers__/utils';

describe('Products Service', () => {
  const host = 'https://api.xxx.extrahorizon.io';
  const productId = productData.id;
  const productResponse = createPagedResponse(productData);

  let sdk: OAuth2Client;

  beforeAll(async () => {
    sdk = createOAuth2Client({
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

  it('should create a product', async () => {
    nock(`${host}${PAYMENTS_BASE}`).post('/products').reply(200, productData);

    const productSchema = await sdk.payments.products.create(newProductData);

    expect(productSchema.id).toBe(productId);
  });

  it('should get a list of products', async () => {
    const rql = rqlBuilder().build();
    nock(`${host}${PAYMENTS_BASE}`)
      .get('/products')
      .reply(200, productResponse);

    const res = await sdk.payments.products.find({ rql });

    expect(res.data.length).toBeGreaterThan(0);
  });

  it('should find a product by id', async () => {
    nock(`${host}${PAYMENTS_BASE}`)
      .get(`/products?eq(id,${productId})`)
      .reply(200, productResponse);

    const product = await sdk.payments.products.findById(productId);

    expect(product.id).toBe(productId);
  });

  it('should find the first product', async () => {
    nock(`${host}${PAYMENTS_BASE}`)
      .get('/products')
      .reply(200, productResponse);

    const product = await sdk.payments.products.findFirst();

    expect(product.id).toBe(productResponse.data[0].id);
  });

  it('should add tags to a product', async () => {
    const rql = rqlBuilder().build();
    nock(`${host}${PAYMENTS_BASE}`).post('/products/addTags').reply(200, {
      affectedRecords: 1,
    });

    const res = await sdk.payments.products.addTagsToProduct(rql, {
      tags: ['tags1'],
    });

    expect(res.affectedRecords).toBe(1);
  });

  it('should remove tags to a product', async () => {
    const rql = rqlBuilder().build();
    nock(`${host}${PAYMENTS_BASE}`).post('/products/removeTags').reply(200, {
      affectedRecords: 1,
    });

    const res = await sdk.payments.products.removeTagsFromProduct(rql, {
      tags: ['tags1'],
    });

    expect(res.affectedRecords).toBe(1);
  });

  it('should update a product', async () => {
    nock(`${host}${PAYMENTS_BASE}`).put(`/products/${productId}`).reply(200, {
      affectedRecords: 1,
    });

    const res = await sdk.payments.products.update(productId, productData);

    expect(res.affectedRecords).toBe(1);
  });

  it('should delete a product', async () => {
    nock(`${host}${PAYMENTS_BASE}`)
      .delete(`/products/${productId}`)
      .reply(200, {
        affectedRecords: 1,
      });

    const res = await sdk.payments.products.remove(productId);

    expect(res.affectedRecords).toBe(1);
  });
});
