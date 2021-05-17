import type { HttpInstance } from '../../types';
import type { ObjectId, AffectedRecords, PagedResult } from '../types';
import type { Task, TaskInput } from './types';
import type { RQLString } from '../../rql';

export default (client, httpAuth: HttpInstance) => ({
  /**
   * View a list of tasks
   * Permission | Scope | Effect
   * - | - | -
   * `VIEW_TASKS` | `gobal` | **Required** for this endpoint
   *
   * @returns any Success
   * @throws {ApiError}
   */
  async find(options?: { rql?: RQLString }): Promise<PagedResult<Task>> {
    return (await client.get(httpAuth, `/${options?.rql || ''}`)).data;
  },

  /**
   * Create a task
   * Permission | Scope | Effect
   * - | - | -
   * `CREATE_TASKS` | `gobal` | **Required** for this endpoint
   *
   * @param requestBody
   * @returns Task Success
   * @throws {ApiError}
   */
  async createTask(requestBody: TaskInput): Promise<Task> {
    return (await client.post(httpAuth, '/', requestBody)).data;
  },

  /**
   * Cancel a task
   * The targeted task **MUST** be in the `new` status.
   *
   * Permission | Scope | Effect
   * - | - | -
   * `CANCEL_TASKS` | `gobal` | **Required** for this endpoint
   *
   * @param taskId The id of the targeted task
   * @returns any Operation successful
   * @throws {IllegalStateException}
   * @throws {ResourceUnknownException}
   */
  async cancelTask(taskId: ObjectId): Promise<AffectedRecords> {
    return (await client.post(httpAuth, `/${taskId}/cancel`)).data;
  },
});
