import FormData from 'form-data';
import type { HttpInstance, HttpRequestConfig } from '../../types';
import { ResultResponse, Results } from '../types';
import type { FilesService } from './types';
import { rqlBuilder } from '../../rql';
import { createCustomFormData, generateBoundary } from './formHelpers';
import { HttpClient } from '../http-client';

export default (client: HttpClient, httpAuth: HttpInstance): FilesService => ({
  async find(options) {
    return (await client.get(httpAuth, `/${options?.rql || ''}`, options)).data;
  },

  async findByName(this: FilesService, name, options) {
    const rqlWithName = rqlBuilder(options?.rql).eq('name', name).build();
    const res = await this.find({ ...options, rql: rqlWithName });
    return res.data[0];
  },

  async findFirst(this: FilesService, options) {
    const res = await this.find(options);
    return res.data[0];
  },

  async createFromText(text, options) {
    const boundary = generateBoundary();
    const formData = createCustomFormData(text, boundary);

    return (
      await client.post(httpAuth, '/', formData, {
        onUploadProgress: ({ loaded, total }) =>
          options?.onUploadProgress({ loaded, total }),
        headers: {
          ...(options?.headers ? options.headers : {}),
          'Content-Type': `multipart/form-data; boundary=${boundary}`,
        },
      })
    ).data;
  },

  async create(fileName, fileData, options) {
    const form = new FormData();
    form.append('name', fileName);
    form.append('file', fileData, fileName);

    if (options?.tags && options.tags.length > 0) {
      options.tags.forEach(value => {
        form.append('tags[]', value);
      });
    }

    const config: HttpRequestConfig = {
      headers: {},
      // Since we don't have resumeable uploads yet, re-directs will trigger a connection timeout error
      maxRedirects: 0,
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    };

    if (options?.onUploadProgress) {
      config.onUploadProgress = ({ loaded, total }) =>
        options.onUploadProgress({ loaded, total });
    }

    if (options?.headers) {
      config.headers = { ...config.headers, ...options.headers };
    }

    if (form.getHeaders) {
      config.headers = { ...config.headers, ...form.getHeaders() };
    } else {
      config.headers['Content-Type'] = 'multipart/form-data';
    }

    const response = await client.post(httpAuth, '/', form, config);
    return response.data;
  },

  async remove(token, options) {
    const result: ResultResponse = await client.delete(
      httpAuth,
      `/${token}`,
      options
    );
    const affectedRecords = result.status === Results.Success ? 1 : 0;
    return { affectedRecords };
  },

  async retrieve(token, options) {
    return (
      await client.get(httpAuth, `/${token}/file`, {
        ...options,
        responseType: 'arraybuffer',
      })
    ).data;
  },

  async retrieveStream(token, options) {
    return await client.get(httpAuth, `/${token}/file`, {
      ...options,
      responseType: 'stream',
    });
  },

  async getDetails(token, options) {
    return (await client.get(httpAuth, `/${token}/details`, options)).data;
  },
});
