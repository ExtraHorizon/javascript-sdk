import { decodeType, record, string } from 'typescript-json-decoder';

export type ExHCredentials = decodeType<typeof exhCredentialsDecoder>;

const exhCredentialsDecoder = record({
  API_HOST: string,
  API_OAUTH_CONSUMER_KEY: string,
  API_OAUTH_CONSUMER_SECRET: string,
  API_OAUTH_TOKEN: string,
  API_OAUTH_TOKEN_SECRET: string,
});

export const parseStoredCredentials = (fileContent: string): ExHCredentials => exhCredentialsDecoder(
  fileContent
    .split(/\r?\n/)
    .map(line => line.split(/=/))
    .filter(line => line.length === 2)
    .reduce((memo, [key, value]) => ({ ...memo, [key]: value }), {})
);
