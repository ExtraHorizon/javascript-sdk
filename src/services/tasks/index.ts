import { ApiRequestService } from '../../types';
import type {
  ApiService,
  FunctionsService,
  HttpInstance,
  LogsService,
  SchedulesService,
} from '../../types';
import httpClient from '../http-client';
import api from './api';
import apiRequests from './apiRequests';
import functions from './functions';
import logs from './logs';
import schedules from './schedules';
import tasks from './tasks';
import { TASKS_BASE } from '../../constants';
import { TasksService } from './types';

export const tasksService = (
  httpWithAuth: HttpInstance
): TasksService & {
  schedules: SchedulesService;
  functions: FunctionsService;
  api: ApiService;
  logs: LogsService;
  apiRequests: ApiRequestService;
} => {
  const client = httpClient({
    basePath: TASKS_BASE,
  });

  return {
    ...tasks(client, httpWithAuth),
    schedules: schedules(client, httpWithAuth),
    functions: functions(client, httpWithAuth),
    api: api(client, httpWithAuth),
    logs: logs(client, httpWithAuth),
    apiRequests: apiRequests(client, httpWithAuth),
  };
};
