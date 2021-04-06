import { HttpInstance, HttpRequestConfig } from '../types';

interface HttpClient {
  basePath: string;
  transformRequestData<R>(args?: R): R;
}

export default ({
  basePath,
  transformRequestData = data => data,
}: HttpClient) => ({
  get: (axios: HttpInstance, url: string, config?: HttpRequestConfig) =>
    axios.get(`${basePath}${url}`, config),
  put: (axios: HttpInstance, url: string, data, config?: HttpRequestConfig) =>
    axios.put(`${basePath}${url}`, transformRequestData(data), config),
});
