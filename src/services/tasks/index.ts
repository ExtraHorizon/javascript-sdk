import type { HttpInstance } from '../../types';
import httpClient from '../http-client';
import tasksTasksService from './tasksService';
import { TASKS_BASE } from '../../constants';

export type TasksService = ReturnType<typeof tasksTasksService>;

export const tasksService = (httpWithAuth: HttpInstance): TasksService => {
  const client = httpClient({
    basePath: TASKS_BASE,
  });

  const tasksMethods = tasksTasksService(client, httpWithAuth);

  return {
    ...tasksMethods,
  };
};
