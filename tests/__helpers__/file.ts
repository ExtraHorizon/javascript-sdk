import { FileDetails, TokenPermission } from '../../src/services/files/types';

const token = '5a0b2adc265ced65a8cab865';
const now = new Date();

export const fileData: FileDetails = {
  tokens: [{ token, accessLevel: TokenPermission.FULL }],
  creatorId: '5a0b2adc265ced65a8cab861',
  updateTimestamp: now,
  creationTimestamp: now,
  name: 'example.json',
  mimetype: 'application/json',
  size: 1000,
  tags: ['api', 'json', 'response'],
};
