export interface ServiceLocation {
  host: string;
  port: number;
}

export interface ServiceLocatorInfo {
  service: string;
  version?: string;
}

export interface ServiceLocator {
  locate: (service: ServiceLocatorInfo) => Promise<ServiceLocation>;
}
