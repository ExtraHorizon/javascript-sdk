import nock from 'nock';
import { AUTH_BASE, DATA_BASE } from '../../../src/constants';
import { Client, client, ParamsOauth2 } from '../../../src/index';
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

  it('Create a comment', async () => {
    nock(`${apiHost}${DATA_BASE}`)
      .post(`/${schemaId}/documents/${documentId}/comments`)
      .reply(200, newCommentCreated);
    const comment = await sdk.data.createComment(schemaId, documentId, {
      text: 'Your comment here',
    });
    expect(comment.id).toBe(newCommentCreated.id);
  });

  it('Request a list of comments', async () => {
    nock(`${apiHost}${DATA_BASE}`)
      .get(`/${schemaId}/documents/${documentId}/comments`)
      .reply(200, commentsListResponse);
    const res = await sdk.data.findComments(schemaId, documentId);
    expect(res.data.length).toBeGreaterThan(0);
  });

  it('Update a comment', async () => {
    nock(`${apiHost}${DATA_BASE}`)
      .put(`/${schemaId}/documents/${documentId}/comments/${commentId}`)
      .reply(200, { affectedRecords: 1 });
    const res = await sdk.data.updateComment(commentId, schemaId, documentId, {
      text: 'My updated comment',
    });
    expect(res.affectedRecords).toBe(1);
  });

  it('Delete a comment', async () => {
    nock(`${apiHost}${DATA_BASE}`)
      .delete(`/${schemaId}/documents/${documentId}/comments/${commentId}`)
      .reply(200, { affectedRecords: 1 });
    const res = await sdk.data.deleteComment(commentId, schemaId, documentId);
    expect(res.affectedRecords).toBe(1);
  });
});
