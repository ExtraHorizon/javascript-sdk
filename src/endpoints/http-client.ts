import { AxiosRequestConfig } from 'axios';

interface HttpClient {
  BASE_PATH: string;
  transformRequestData<R = unknown>(args?: R): R;
}
export default ({ BASE_PATH, transformRequestData }: HttpClient) => {
  console.log('BASE_PATH`', BASE_PATH);
  return {
    get: (axios, path, config?: AxiosRequestConfig) =>
      axios.get(`${BASE_PATH}${path}`, config),
    put: (axios, path, data) =>
      axios.put(`${BASE_PATH}${path}`, transformRequestData(data)),
  };
};
