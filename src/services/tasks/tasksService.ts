import type { HttpInstance } from '../../types';
import { AffectedRecords } from '../models/Responses';
import { ObjectId } from '../models/ObjectId';
import type { TasksList, Task, TaskInput } from './types';

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
  async getList(): Promise<TasksList> {
    return (await client.get(httpAuth, '/')).data;
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
