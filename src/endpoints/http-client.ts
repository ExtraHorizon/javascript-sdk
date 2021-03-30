import { AxiosInstance, AxiosRequestConfig } from 'axios';

interface HttpClient {
  BASE_PATH: string;
  transformRequestData<R = unknown>(args?: R): R;
}
export default ({ BASE_PATH, transformRequestData }: HttpClient) => {
  console.log('BASE_PATH`', BASE_PATH);
  return {
    get: (axios: AxiosInstance, path: string, config?: AxiosRequestConfig) => axios.get(`${BASE_PATH}${path}`, config),
    put: (axios: AxiosInstance, path: string, data) => axios.put(`${BASE_PATH}${path}`, transformRequestData(data)),
  };
};
