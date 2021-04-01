import { HttpInstance, HttpRequestConfig } from '../types';

interface IHttpClient {
  basePath: string;
  transformRequestDataFn<R>(args?: R): R;
}

export interface HttpClientWrapper {
  withAuth(useAuth: boolean): this;
  decamelizeRequest(transformData: boolean): this;
  withResponseObject(getResponseObject: boolean): this;
  get(url: string, config?: HttpRequestConfig): any;
  put(url: string, data, config?: HttpRequestConfig): any;
}

export default (httpInstance: HttpInstance, httpAuthInstance: HttpInstance) =>
  ({ basePath, transformRequestDataFn } : IHttpClient): HttpClientWrapper => {

    class HttpClient {

      private returnResponseData = true;

      private http = httpAuthInstance;

      private applyRequestDataTransformation = true;

      private handleResponse = (res) => this.returnResponseData ? res.data : res;

      private handleException = (e) => {
        // TODO: implement handle exception
        console.log('GOT EXCEPTION: ', e);
        // throw new Error(e);
      }

      withAuth(useAuth: boolean) {
        this.http = useAuth ? httpAuthInstance : httpInstance;
        return this;
      }

      decamelizeRequest(transformData: boolean) {
        this.applyRequestDataTransformation = transformData;
        return this;
      }

      withResponseObject(getResponseObject: boolean) {
        this.returnResponseData = !getResponseObject;
        return this;
      }

      get(url: string, config?: HttpRequestConfig) {
        return this.http.get(`${basePath}${url}`, config)
          .then(this.handleResponse)
          .catch(this.handleException);
      }
  
      put(url: string, data, config?: HttpRequestConfig) {
        const requestData = this.applyRequestDataTransformation ? transformRequestDataFn(data) : data;
        return this.http.put(`${basePath}${url}`, requestData, config)
          .then(this.handleResponse)
          .catch(this.handleException);
      }

    }

    return new HttpClient();
};
