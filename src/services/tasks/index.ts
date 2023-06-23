import type { HttpInstance } from '../../types';
import httpClient from '../http-client';
import tasks from './tasks';
import { TASKS_BASE } from '../../constants';
import { TasksService } from './types';
import api from './api';

export const tasksService = (httpWithAuth: HttpInstance): TasksService => {
  const client = httpClient({
    basePath: TASKS_BASE,
  });

  return {
    ...tasks(client, httpWithAuth),
    api: api(client, httpWithAuth),
  };
};
