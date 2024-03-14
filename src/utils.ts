import { ClientParams, GlobalPermissionName } from './types';

function parseHost(rawHost: string, prefix: 'api' | 'apx') {
  const validHostEnd = rawHost.endsWith('/') ?
    rawHost.substring(0, rawHost.length - 1) :
    rawHost;

  return validHostEnd.includes('localhost') ?
    validHostEnd :
    `https://${prefix}.${validHostEnd
      .replace(/^https?:\/\//, '')
      .replace(/^api\./, '')
      .replace(/^apx\./, '')}`;
}

export function validateConfig<T extends ClientParams>(params: T): T {
  if ('consumerKey' in params) {
    return {
      ...params,
      host: parseHost(params.host, 'api'),
    };
  }

  if ('clientId' in params) {
    return {
      ...params,
      host: parseHost(params.host, 'api'),
    };
  }

  return {
    ...params,
    host: parseHost(params.host, 'apx'),
  };
}

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

export function parseGlobalPermissions(
  permissions: string[]
): GlobalPermissionName[] {
  const GlobalPermissionNameValues = Object.values(GlobalPermissionName);

  return permissions
    .map(element => {
      if (!GlobalPermissionNameValues.includes(GlobalPermissionName[element])) {
        console.warn(`${element} is not a valid permission.`);
      }
      return GlobalPermissionName[element];
    })
    .filter(element => element);
}
