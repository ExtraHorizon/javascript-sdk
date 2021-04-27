import type { HttpInstance } from '../../types';
import httpClient from '../http-client';
import tasksService from './tasksService';
import { TASKS_BASE } from '../../constants';

export type TasksService = ReturnType<typeof tasksService>;

export default (httpWithAuth: HttpInstance): TasksService => {
  const client = httpClient({
    basePath: TASKS_BASE,
  });

  const tasksMethods = tasksService(client, httpWithAuth);

  return {
    ...tasksMethods,
  };
};
