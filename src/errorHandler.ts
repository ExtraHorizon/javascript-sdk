import { ResourceUnknownError, ApiError, HttpError } from './errors';

const ErrorClassDefinitionsMap = {
  16: ResourceUnknownError,
};

export function typeReceivedError(error: HttpError) {
  const ErrorClassDefinition =
    ErrorClassDefinitionsMap[error?.response?.data?.code];

  if (!ErrorClassDefinition) {
    return new ApiError(error);
  }

  return new ErrorClassDefinition(error);
}
