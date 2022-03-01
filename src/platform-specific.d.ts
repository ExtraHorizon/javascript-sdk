type Platform =
  | { type: 'react-native'; platform: 'android' }
  | { type: 'react-native'; platform: 'ios' }
  | {
      type: 'js';
      platform: 'browser';
    }
  | {
      type: 'react-native';
      platform: 'windows';
    }
  | {
      type: 'js';
      platform: 'nodejs';
    };

declare let platform: Platform;
declare module 'platform-specific' {
  export default platform;
}
