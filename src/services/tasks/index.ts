import type { HttpInstance } from '../../types';
import httpClient from '../http-client';
import tasks from './tasks';
import { TASKS_BASE } from '../../constants';

export type TasksService = ReturnType<typeof tasks>;

export const tasksService = (httpWithAuth: HttpInstance): TasksService => {
  const client = httpClient({
    basePath: TASKS_BASE,
  });

  const tasksMethods = tasks(client, httpWithAuth);

  return {
    ...tasksMethods,
  };
};
