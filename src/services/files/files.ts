import type { ReadStream } from 'fs';
import FormData from 'form-data';
import type { HttpInstance } from '../../types';
import {
  ResultResponse,
  Results,
  PagedResult,
  AffectedRecords,
} from '../types';
import type { FileDetails, FilesService, Token } from './types';
import { RQLString, rqlBuilder } from '../../rql';
import { createCustomFormData, generateBoundary } from './formHelpers';

export default (client, httpAuth: HttpInstance): FilesService => ({
  async find(options?: { rql?: RQLString }): Promise<PagedResult<FileDetails>> {
    console.log('this', this);
    return (await client.get(httpAuth, `/${options?.rql || ''}`)).data;
  },

  async findByName(
    name: string,
    options?: { rql?: RQLString }
  ): Promise<FileDetails> {
    const rqlWithName = rqlBuilder(options?.rql).eq('name', name).build();
    const res = await this.find({ rql: rqlWithName });
    return res.data[0];
  },

  async findFirst(options?: { rql?: RQLString }): Promise<FileDetails> {
    const res = await this.find(options);
    return res.data[0];
  },

  async createFromText(text: string): Promise<FileDetails> {
    const boundary = generateBoundary();
    const formData = createCustomFormData(text, boundary);

    return (
      await client.post(httpAuth, '/', formData, {
        headers: {
          'Content-Type': `multipart/form-data; boundary=${boundary}`,
        },
      })
    ).data;
  },

  async create(
    fileName: string,
    fileData: Blob | Buffer | ReadStream,
    options?: { tags: [] }
  ): Promise<FileDetails> {
    const form = new FormData();
    if (typeof window !== 'undefined' && !(fileData instanceof Blob)) {
      throw new Error(
        'In the frontend you should use Blob. https://developer.mozilla.org/en-US/docs/Web/API/Blob/Blob'
      );
    }
    form.append('name', fileName);
    form.append('file', fileData, fileName);

    if (options?.tags && options.tags.length > 0) {
      form.append('tags', options.tags);
    }

    return (
      await client.post(httpAuth, '/', form, {
        headers:
          typeof window === 'undefined'
            ? form.getHeaders()
            : { 'Content-Type': 'multipart/form-data' },
      })
    ).data;
  },

  async remove(token: Token): Promise<AffectedRecords> {
    const result: ResultResponse = await client.delete(httpAuth, `/${token}`);
    const affectedRecords = result.status === Results.Success ? 1 : 0;
    return { affectedRecords };
  },

  async retrieve(token: Token): Promise<Buffer> {
    return (
      await client.get(httpAuth, `/${token}/file`, {
        responseType: 'arraybuffer',
      })
    ).data;
  },

  async retrieveStream(token: Token): Promise<{ data: ReadStream }> {
    return await client.get(httpAuth, `/${token}/file`, {
      responseType: 'stream',
    });
  },

  async getDetails(token: Token): Promise<FileDetails> {
    return (await client.get(httpAuth, `/${token}/details`)).data;
  },
});
