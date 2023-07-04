import { HttpInstance } from '../../../../http/types';
import { HttpClient } from '../../../http-client';
import { ApiRequestService } from './types';
import logs from './logs';

export default (
  client: HttpClient,
  httpAuth: HttpInstance
): ApiRequestService => ({
  logs: logs(client, httpAuth),
});
