import {
  Localization,
  BulkCreationResponse,
  BulkUpdateResponse,
  LocalizationRequest,
  SupportedLanguageCodes,
} from '../../src/services/localizations/types';

export const localizationInput = {
  key: 'mail_subject',
  text: {
    EN: 'Your purchase',
    FR: 'Votre achat',
    NL: 'Je aankoop',
  },
};

export const localizationData: Localization = {
  ...localizationInput,
  creationTimestamp: new Date(1494840721210),
  updateTimestamp: new Date(1499430857362),
};

export const localizationResponse = {
  page: {
    total: 1,
    offset: 0,
    limit: 20,
  },
  data: [localizationData],
};

export const localizationCreatedResponse: BulkCreationResponse = {
  created: 0,
  existing: 1,
  existingIds: ['mail_subject'],
};

export const localizationUpdatedResponse: BulkUpdateResponse = {
  updated: 0,
  missing: 1,
  missingIds: ['mail_subject'],
};

export const localizationRequest: LocalizationRequest = {
  localizationCodes: [SupportedLanguageCodes.NL],
  localizations: ['mail_subject'],
};
