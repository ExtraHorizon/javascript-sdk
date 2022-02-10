import * as fs from 'fs';
import * as path from 'path';
import { decodeType, record, string } from 'typescript-json-decoder';

const EXH_CONFIG_FILE_DIR = path.join(process.env.HOME, '/.exh');
const EXH_CONFIG_FILE = `${EXH_CONFIG_FILE_DIR}/credentials`;

export type ExHCredentials = decodeType<typeof exhCredentialsDecoder>;

const exhCredentialsDecoder = record({
  API_HOST: string,
  API_OAUTH_CONSUMER_KEY: string,
  API_OAUTH_CONSUMER_SECRET: string,
  API_OAUTH_TOKEN: string,
  API_OAUTH_TOKEN_SECRET: string,
});

const readFile = () => {
  try {
    return fs.readFileSync(EXH_CONFIG_FILE, 'utf-8');
  } catch (err) {
    throw new Error(
      'Failed to open credentials file. Make sure they are correctly specified in ~/.exh/credentials'
    );
  }
};

export const readStoredCredentials = (): ExHCredentials =>
  exhCredentialsDecoder(
    readFile()
      .split(/\r?\n/)
      .map(line => line.split(/=/))
      .filter(line => line.length === 2)
      .reduce((memo, [key, value]) => ({ ...memo, [key]: value }), {})
  );
