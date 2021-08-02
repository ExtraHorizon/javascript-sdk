// import axios from 'axios';
// import { ServiceInfo, ServiceLocator, ServiceOptions, Method } from './types';
// import { locateService } from './lib/serviceLocator';
// import {
//   addQueryToPath,
//   errorResponseToQError,
//   isPagedResponse,
//   buildAxiosRequestOptions,
// } from './lib/utils';

// export async function raw(
//   locator: ServiceLocator,
//   info: ServiceInfo,
//   options: ServiceOptions
// ) {
//   const { host, port } = await locateService(locator, info);
//   const axiosRequestOptions = buildAxiosRequestOptions(host, port, options);
//   try {
//     const response = await axios.request(axiosRequestOptions);
//     return response.data;
//   } catch (err) {
//     throw errorResponseToQError(err, options.throwReceivedExceptions);
//   }
// }

// export function json(
//   locator: ServiceLocator,
//   info: ServiceInfo,
//   options: ServiceOptions,
//   data?: any
// ) {
//   const rawOptions = { ...options };
//   if (data !== undefined) {
//     rawOptions.data = data;
//   }
//   return raw(locator, info, rawOptions);
// }

// export function get(
//   locator: ServiceLocator,
//   info: ServiceInfo,
//   options: ServiceOptions
// ) {
//   return json(locator, info, { ...options, method: Method.GET });
// }

// export function post(
//   locator: ServiceLocator,
//   info: ServiceInfo,
//   options: ServiceOptions,
//   data?: any
// ) {
//   return json(locator, info, { ...options, method: Method.POST }, data);
// }
// export function put(
//   locator: ServiceLocator,
//   info: ServiceInfo,
//   options: ServiceOptions,
//   data?: any
// ) {
//   return json(locator, info, { ...options, method: Method.PUT }, data);
// }
// export function remove(
//   locator: ServiceLocator,
//   info: ServiceInfo,
//   options: ServiceOptions
// ) {
//   return json(locator, info, { ...options, method: Method.DELETE });
// }
// export async function list(
//   locator: ServiceLocator,
//   info: ServiceInfo,
//   options: ServiceOptions,
//   limit = 100,
//   skip = 0
// ) {
//   const items = [];
//   let total = 0;
//   let nextSkip = skip;
//   do {
//     const path = addQueryToPath(options.path, `limit(${limit},${nextSkip})`);
//     const response = await get(locator, info, { ...options, path });
//     if (!isPagedResponse(response)) {
//       throw new Error('Did not receive a list response!');
//     }
//     total = response.page.total;
//     nextSkip += response.data.length;
//     items.push(...response.data);
//   } while (nextSkip < total);
//   return items;
// }
// export async function first(
//   locator: ServiceLocator,
//   info: ServiceInfo,
//   options: ServiceOptions
// ) {
//   const path = addQueryToPath(options.path, 'limit(1)');
//   const response = await get(locator, info, { ...options, path });
//   if (!isPagedResponse(response))
//     throw new Error('Did not receive a list response!');
//   return response.data[0];
// }
