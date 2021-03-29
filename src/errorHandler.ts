import { AxiosError } from 'axios';
import { ResourceUnknownError, ApiError } from './errors';

const ErrorClassDefinitionsMap = {
  16: ResourceUnknownError,
};

export function typeReceivedError(error: AxiosError) {
  const ErrorClassDefinition =
    ErrorClassDefinitionsMap[error?.response?.data?.code];

  if (!ErrorClassDefinition) {
    return new ApiError(error);
  }

  return new ErrorClassDefinition(error);
}
