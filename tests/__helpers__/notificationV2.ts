import { NotificationV2, NotificationV2Creation } from '../../src/services/notificationsV2/types';
import { NotificationV2UserSettings, NotificationV2UserSettingsUpsert } from '../../src/services/notificationsV2/userSettings/types';
import { randomHexString } from './utils';

export const notificationV2UserUpdateData = (overrides?: NotificationV2UserSettingsUpsert): NotificationV2UserSettingsUpsert => ({
  fcmToken: randomHexString(),
  ...overrides,
});

export const notificationV2UserData = (overrides?: Partial<NotificationV2UserSettings>): NotificationV2UserSettings => ({
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
