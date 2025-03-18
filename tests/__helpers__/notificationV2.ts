import { NotificationV2, NotificationV2Creation } from '../../src/services/notificationsV2/types';
import { NotificationV2User, NotificationV2UserUpsert } from '../../src/services/notificationsV2/users/types';
import { randomHexString } from './utils';

export const notificationV2UserCreationData = (overrides?: NotificationV2UserUpsert): NotificationV2UserUpsert => ({
  fcmToken: randomHexString(),
  ...overrides,
});

export const notificationV2UserData = (overrides?: Partial<NotificationV2User>): NotificationV2User => ({
  id: randomHexString(),
  fcmToken: randomHexString(),
  creationTimestamp: new Date(1550577829354),
  updateTimestamp: new Date(1550577829354),
  ...overrides,
});

export const notificationV2CreationData = (overrides?: Partial<NotificationV2Creation>): NotificationV2Creation => ({
  targetUserId: randomHexString(),
  title: 'Test notification title',
  body: 'Test notification body',
  ...overrides,
});

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
