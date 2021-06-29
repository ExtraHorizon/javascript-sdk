import nock from 'nock';
import { AUTH_BASE, DATA_BASE } from '../../../src/constants';
import { Client, createClient, ParamsOauth2 } from '../../../src/index';
import { rqlBuilder } from '../../../src/rql';
import {
  newCommentCreated,
  commentData,
  commentsListResponse,
} from '../../__helpers__/data';

describe('Comments Service', () => {
  const { schemaId } = commentData;
  const documentId = '2e9fff9d90135a2a9a718e2f';
  const commentId = commentData.id;
  const host = 'https://api.xxx.fibricheck.com';
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

  it('should create a comment', async () => {
    nock(`${host}${DATA_BASE}`)
      .post(`/${schemaId}/documents/${documentId}/comments`)
      .reply(200, newCommentCreated);
    const comment = await sdk.data.comments.create(schemaId, documentId, {
      text: 'Your comment here',
    });
    expect(comment.id).toBe(newCommentCreated.id);
  });

  it('should request a list of comments', async () => {
    const rql = rqlBuilder().build();
    nock(`${host}${DATA_BASE}`)
      .get(`/${schemaId}/documents/${documentId}/comments`)
      .reply(200, commentsListResponse);
    const res = await sdk.data.comments.find(schemaId, documentId, { rql });
    expect(res.data.length).toBeGreaterThan(0);
  });

  it('should find a comment by id', async () => {
    nock(`${host}${DATA_BASE}`)
      .get(`/${schemaId}/documents/${documentId}/comments?eq(id,${commentId})`)
      .reply(200, commentsListResponse);

    const comment = await sdk.data.comments.findById(
      commentId,
      schemaId,
      documentId
    );

    expect(comment.id).toBe(commentId);
  });

  it('should find the first comment', async () => {
    nock(`${host}${DATA_BASE}`)
      .get(`/${schemaId}/documents/${documentId}/comments`)
      .reply(200, commentsListResponse);

    const comment = await sdk.data.comments.findFirst(schemaId, documentId);

    expect(comment.id).toBe(commentId);
  });

  it('should update a comment', async () => {
    nock(`${host}${DATA_BASE}`)
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
    nock(`${host}${DATA_BASE}`)
      .delete(`/${schemaId}/documents/${documentId}/comments/${commentId}`)
      .reply(200, { affectedRecords: 1 });
    const res = await sdk.data.comments.remove(commentId, schemaId, documentId);
    expect(res.affectedRecords).toBe(1);
  });
});
