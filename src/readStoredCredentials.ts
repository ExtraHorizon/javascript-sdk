import * as fs from 'fs';
import * as path from 'path';

export const EXH_CONFIG_FILE_DIR = path.join(process.env.HOME, '/.exh');
export const EXH_CONFIG_FILE = `${EXH_CONFIG_FILE_DIR}/credentials`;

export interface ExHCredentials {
  API_HOST?: string;
  API_OAUTH_CONSUMER_KEY?: string;
  API_OAUTH_CONSUMER_SECRET?: string;
  API_OAUTH_TOKEN?: string;
  API_OAUTH_TOKEN_SECRET?: string;
}

const readFile = () => {
  try {
    const credentialsFile = fs.readFileSync(EXH_CONFIG_FILE, 'utf-8');
    return credentialsFile;
  } catch (err) {
    throw new Error(
      'Failed to open credentials file. Make sure they are correctly specified in ~/.exh/credentials'
    );
  }
};

export const readStoredCredentials = (): ExHCredentials => {
  const credentials = readFile()
    .split(/\r?\n/)
    .map(line => line.split(/=/))
    .filter(line => line.length === 2)
    .reduce<ExHCredentials>(
      (memo, [key, value]) => ({ ...memo, [key]: value }),
      {}
    );

  if (!credentials.API_HOST) {
    throw new Error('Missing credentials parameter API_HOST');
  }
  if (!credentials.API_OAUTH_CONSUMER_KEY) {
    throw new Error('Missing credential parameters API_OAUTH_CONSUMER_KEY');
  }
  if (!credentials.API_OAUTH_CONSUMER_SECRET) {
    throw new Error('Missing credential parameters API_OAUTH_CONSUMER_SECRET');
  }
  if (!credentials.API_OAUTH_TOKEN) {
    throw new Error('Missing credentials parameter API_OAUTH_TOKEN');
  }
  if (!credentials.API_OAUTH_TOKEN_SECRET) {
    throw new Error('Missing credentials parameter API_OAUTH_TOKEN_SECRET');
  }

  return credentials;
};
