import { OptionsWithRql } from '../../types';

export interface LogsAccessService {
  /**
   * ## Retrieve a list of access logs
   *
   * **Global Permissions:**
   * - `VIEW_ACCESS_LOGS` - Allows a user to view access logs
   * @param options {@link OptionsWithRql} - Add filters to the requested list
   * @returns An array of access logs {@link AccessLog AccessLog[]}
   */
  find(options?: OptionsWithRql): Promise<AccessLog[]>;

  /**
   * ## Retrieve the first queried access log
   *
   * **Global Permissions:**
   * - `VIEW_ACCESS_LOGS` - Allows a user to view access logs
   * @param options {@link OptionsWithRql} - Add filters to the requested list
   * @returns The first element of the queried access logs {@link AccessLog}
   */
  findFirst(options?: OptionsWithRql): Promise<AccessLog>;
}

export interface AccessLog {
  /** The time of request receival */
  timestamp: string;
  /** The status code of the response for the request */
  httpStatus: number;
  /** The duration of the request in seconds */
  duration: number;
  /** The Extra Horizon id of the request initiator */
  userId: string;
  /** The IP address of the request's origin */
  userAddress: string;
  /** The domain or IP of the accessed Extra Horizon deployment */
  host: string;
  /** The HTTP request */
  request: string;
  /** The size of the response in Bytes */
  responseBodySize: number;
  /** The signature of the request device and software */
  userAgent: string;
}
