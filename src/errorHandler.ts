import { QError } from '@qompium/q-errors';
import { MissingRequiredFieldsError, ResourceUnknownError } from './errors';
import { EmailUsedError } from './users/errors';

const ErrorClassDefinitions = [
  ResourceUnknownError,
  MissingRequiredFieldsError,
  EmailUsedError,
];

export function typeReceivedError(error) {
  if (!(error instanceof QError)) {
    return new Error('generic error'); // TODO
  }

  const ErrorClassDefinition = ErrorClassDefinitions.find(
    definition => error.qName === definition.qName
  );

  if (!ErrorClassDefinition) {
    return new Error('generic error'); // TODO
  }

  return new ErrorClassDefinition(error);
}
