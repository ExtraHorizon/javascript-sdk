import { ApiError } from '../errors';

export class EmailUsedError extends ApiError {
  static qName = 'EMAIL_USED_EXCEPTION';
}
