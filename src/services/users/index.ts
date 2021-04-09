import { decamelizeKeys } from 'humps';
import type { HttpInstance } from '../../types';
import httpClient from '../http-client';
import healthService from './healthService';
import usersService from './usersService';

export default (http: HttpInstance, httpWithAuth: HttpInstance) => {
  const userClient = httpClient({
    basePath: '/users/v1',
    transformRequestData: decamelizeKeys,
  });
  
  const healthMethods = healthService(userClient, http);
  const usersMethods = usersService(userClient, http, httpWithAuth);
  

  return {
    ...healthMethods,
    ...usersMethods
  };
};
