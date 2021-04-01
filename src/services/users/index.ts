// import type { HttpInstance } from '../../types';
import { HttpClientWrapper } from '../http-client';
import healthService from './healthService';
import usersService from './usersService';

export default (httpClient: HttpClientWrapper) => ({
    ...healthService(httpClient),
    ...usersService(httpClient),
  })
