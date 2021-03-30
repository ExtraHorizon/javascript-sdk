import { AxiosInstance, AxiosRequestConfig } from 'axios';

interface HttpClient {
  basePath: string;
  transformRequestData<R = any>(args?: R): R;
}
export default ({
  basePath,
  transformRequestData = data => data,
}: HttpClient) => ({
  get: (axios: AxiosInstance, url: string, config?: AxiosRequestConfig) =>
    axios.get(`${basePath}${url}`, config),
  put: (axios: AxiosInstance, url: string, data, config?: AxiosRequestConfig) =>
    axios.put(`${basePath}${url}`, transformRequestData(data), config),
});
