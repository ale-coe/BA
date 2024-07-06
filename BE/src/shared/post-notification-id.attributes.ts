export interface IPostNotificationSubscriptionAttributes {
  endpoint: string;
  expirationTime: null | number;
  keys: IKeysAttributes;
}

export interface IKeysAttributes {
  p256dh: string;
  auth: string;
}
