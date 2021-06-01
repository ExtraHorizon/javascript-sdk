import nock from 'nock';
import { AUTH_BASE, DATA_BASE } from '../../../src/constants';
import { Client, client, ParamsOauth2 } from '../../../src/index';
import { rqlBuilder } from '../../../src/rql';
import {
  newCommentCreated,
  commentsListResponse,
} from '../../__helpers__/data';

describe('Comments Service', () => {
  const schemaId = '1e9fff9d90135a2a9a718e2f';
  const documentId = '2e9fff9d90135a2a9a718e2f';
  const commentId = '3e9fff9d90135a2a9a718e2f';
  const apiHost = 'https://api.xxx.fibricheck.com';
  let sdk: Client<ParamsOauth2>;

  beforeAll(async () => {
    sdk = client({
      apiHost,
      clientId: '',
    });

    const mockToken = 'mockToken';
    nock(apiHost)
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

  it('should create a comment', async () => {
    nock(`${apiHost}${DATA_BASE}`)
      .post(`/${schemaId}/documents/${documentId}/comments`)
      .reply(200, newCommentCreated);
    const comment = await sdk.data.comments.create(schemaId, documentId, {
      text: 'Your comment here',
    });
    expect(comment.id).toBe(newCommentCreated.id);
  });

  it('should request a list of comments', async () => {
    const rql = rqlBuilder().build();
    nock(`${apiHost}${DATA_BASE}`)
      .get(`/${schemaId}/documents/${documentId}/comments`)
      .reply(200, commentsListResponse);
    const res = await sdk.data.comments.find(schemaId, documentId, { rql });
    expect(res.data.length).toBeGreaterThan(0);
  });

  it('should update a comment', async () => {
    nock(`${apiHost}${DATA_BASE}`)
      .put(`/${schemaId}/documents/${documentId}/comments/${commentId}`)
      .reply(200, { affectedRecords: 1 });
    const res = await sdk.data.comments.update(
      commentId,
      schemaId,
      documentId,
      {
        text: 'My updated comment',
      }
    );
    expect(res.affectedRecords).toBe(1);
  });

  it('should delete a comment', async () => {
    nock(`${apiHost}${DATA_BASE}`)
      .delete(`/${schemaId}/documents/${documentId}/comments/${commentId}`)
      .reply(200, { affectedRecords: 1 });
    const res = await sdk.data.comments.delete(commentId, schemaId, documentId);
    expect(res.affectedRecords).toBe(1);
  });
});
