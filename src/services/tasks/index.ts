import type { HttpInstance } from '../../types';
import httpClient from '../http-client';
import { withFindMethods } from '../helpers';
import tasks from './tasks';
import { TASKS_BASE } from '../../constants';

export type TasksService = ReturnType<typeof tasks> &
  ReturnType<typeof withFindMethods>;

export const tasksService = (httpWithAuth: HttpInstance): TasksService => {
  const client = httpClient({
    basePath: TASKS_BASE,
  });

  const tasksMethods = tasks(client, httpWithAuth);
  const tasksFindMethods = withFindMethods(tasksMethods.find);

  return {
    ...tasksMethods,
    ...tasksFindMethods,
  };
};
