import { QError } from '@qompium/q-errors';

export class ApiError {
  qError: QError;

  constructor(qError) {
    this.qError = qError;
  }
}

export class ResourceUnknownError extends ApiError {
  static qName = 'RESOURCE_UNKNOWN_EXCEPTION';
}

export class MissingRequiredFieldsError extends ApiError {
  static qName = 'MISSING_REQUIRED_FIELDS_EXCEPTION';

  requiredFields: string[];

  constructor(qError: QError) {
    super(qError);
    this.requiredFields = this.qError.details.required_fields;
  }
}
