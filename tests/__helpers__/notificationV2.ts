import { NotificationV2 } from '../../src/services/notificationsV2/types';
import { randomHexString } from './utils';

export const notificationV2Data = (overrides?: Partial<NotificationV2>): NotificationV2 => ({
  id: randomHexString(),
  creatorId: randomHexString(),
  targetUserId: randomHexString(),
  title: 'Test notification title',
  body: 'Test notification body',
  sent: true,
  creationTimestamp: new Date(1550577829354),
  updateTimestamp: new Date(1550577829354),
  ...overrides,
});
