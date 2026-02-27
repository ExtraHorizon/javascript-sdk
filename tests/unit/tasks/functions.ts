import nock from 'nock';
import { createClient } from '../../../src';
import { TASKS_BASE } from '../../../src/constants';
import {
  directExecutionResponse,
  directExecutionResponseWithSnakeCasedCustomData,
  InputType,
  OutputType,
} from '../../__helpers__/task';
import { createPagedResponse } from '../../__helpers__/utils';

describe('Tasks - Functions', () => {
  const host = 'https://api.xxx.extrahorizon.com';
  const exh = createClient({ host, clientId: '' });

  describe('find', () => {
    it('Lists functions', async () => {
      const responseFunction = {
        name: 'test_function',
        description: 'A test function',
        updateTimestamp: '2023-07-04T12:00:00.000Z',
      };

      nock(`${host}${TASKS_BASE}`)
        .get('/functions/')
        .reply(200, createPagedResponse(responseFunction));

      const result = await exh.tasks.functions.find();

      expect(result.data).toHaveLength(1);
      expect(result.data[0]).toStrictEqual({
        ...responseFunction,
        updateTimestamp: new Date('2023-07-04T12:00:00.000Z'),
      });
    });
  });

  describe('create', () => {
    it('Creates a function', async () => {
      const data = {
        name: 'new_function',
        code: 'console.log("Hello, World!");',
        entryPoint: 'index.handler',
        runtime: 'nodejs24.x',
      };

      nock(`${host}${TASKS_BASE}`)
        .post('/functions/', data)
        .reply(200, {
          ...data,
          enabled: true,
          updateTimestamp: '2023-07-04T12:00:00.000Z',
        });

      const result = await exh.tasks.functions.create(data);

      expect(result).toStrictEqual({
        ...data,
        enabled: true,
        updateTimestamp: new Date('2023-07-04T12:00:00.000Z'),
      });
    });

    it('Does not transform customized fields in the request or response', async () => {
      const data = {
        name: 'new_function',
        code: 'console.log("Hello, World!");',
        entryPoint: 'index.handler',
        runtime: 'nodejs24.x',
        environmentVariables: {
          updateTimestamp: { value: '2023-07-04T12:00:00.000Z' },
          my_custom_field: { value: 'custom_value' },
        },
      };

      nock(`${host}${TASKS_BASE}`)
        .post('/functions/', data)
        .reply(200, {
          ...data,
          enabled: true,
          updateTimestamp: '2023-07-04T12:00:00.000Z',
        });

      const result = await exh.tasks.functions.create(data);

      expect(result).toStrictEqual({
        ...data,
        enabled: true,
        updateTimestamp: new Date('2023-07-04T12:00:00.000Z'),
      });
    });
  });

  describe('getByName', () => {
    it('Gets the function details by its name', async () => {
      const functionName = 'existing_function';
      const response = {
        name: 'new_function',
        entryPoint: 'index.handler',
        runtime: 'nodejs24.x',
        enabled: true,
        updateTimestamp: '2023-07-04T12:00:00.000Z',
      };

      nock(`${host}${TASKS_BASE}`)
        .get(`/functions/${functionName}`)
        .reply(200, response);

      const result = await exh.tasks.functions.getByName(functionName);

      expect(result).toStrictEqual({
        ...response,
        updateTimestamp: new Date('2023-07-04T12:00:00.000Z'),
      });
    });

    it('Does not transform customized fields in the response', async () => {
      const functionName = 'existing_function';
      const response = {
        name: 'new_function',
        entryPoint: 'index.handler',
        runtime: 'nodejs24.x',
        enabled: true,
        updateTimestamp: '2023-07-04T12:00:00.000Z',
        environmentVariables: {
          updateTimestamp: { value: '2023-07-04T12:00:00.000Z' },
          my_custom_field: { value: 'custom_value' },
        },
      };

      nock(`${host}${TASKS_BASE}`)
        .get(`/functions/${functionName}`)
        .reply(200, response);

      const result = await exh.tasks.functions.getByName(functionName);

      expect(result).toStrictEqual({
        ...response,
        updateTimestamp: new Date('2023-07-04T12:00:00.000Z'),
      });
    });
  });

  describe('update', () => {
    it('Updates a function', async () => {
      const functionName = 'existing_function';
      const data = {
        description: 'Updated description',
      };

      nock(`${host}${TASKS_BASE}`)
        .put(`/functions/${functionName}`, data)
        .reply(200, { affectedRecords: 1 });

      const result = await exh.tasks.functions.update(functionName, data);

      expect(result).toStrictEqual({ affectedRecords: 1 });
    });
  });

  describe('remove', () => {
    it('Deletes a function', async () => {
      const functionName = 'function_to_remove';

      nock(`${host}${TASKS_BASE}`)
        .delete(`/functions/${functionName}`)
        .reply(200, { affectedRecords: 1 });

      const result = await exh.tasks.functions.remove(functionName);

      expect(result).toStrictEqual({ affectedRecords: 1 });
    });
  });

  describe('enable', () => {
    it('Enables a function', async () => {
      const functionName = 'function_to_enable';

      nock(`${host}${TASKS_BASE}`)
        .post(`/functions/${functionName}/enable`, {})
        .reply(200, { affectedRecords: 1 });

      const result = await exh.tasks.functions.enable(functionName);

      expect(result).toStrictEqual({ affectedRecords: 1 });
    });
  });

  describe('disable', () => {
    it('Disables a function', async () => {
      const functionName = 'function_to_disable';

      nock(`${host}${TASKS_BASE}`)
        .post(`/functions/${functionName}/disable`, {})
        .reply(200, { affectedRecords: 1 });

      const result = await exh.tasks.functions.disable(functionName);

      expect(result).toStrictEqual({ affectedRecords: 1 });
    });
  });

  describe('execute', () => {
    const functionName = 'test_to_execute';

    it('Executes a Function', async () => {
      nock(`${host}${TASKS_BASE}`)
        .post(`/functions/${functionName}/execute`, {
          data: directExecutionResponse.data,
        })
        .reply(200, directExecutionResponse);

      const response = await exh.tasks.functions.execute<OutputType, InputType>(
        functionName,
        directExecutionResponse.data,
        {}
      );

      expect(response).toBeDefined();
    });

    it('Does not transform custom data in execution responses', async () => {
      nock(`${host}${TASKS_BASE}`)
        .post(`/functions/${functionName}/execute`, {
          data: directExecutionResponseWithSnakeCasedCustomData.data,
        })
        .reply(200, directExecutionResponseWithSnakeCasedCustomData);

      const response = await exh.tasks.functions.execute(
        functionName,
        directExecutionResponseWithSnakeCasedCustomData.data,
        {}
      );

      expect(response.data).toStrictEqual(
        directExecutionResponseWithSnakeCasedCustomData.data
      );
      expect(response.result).toStrictEqual(
        directExecutionResponseWithSnakeCasedCustomData.result
      );
    });

    it('Transforms Extra Horizon timestamps to date objects', async () => {
      nock(`${host}${TASKS_BASE}`)
        .post(`/functions/${functionName}/execute`, {
          data: directExecutionResponseWithSnakeCasedCustomData.data,
        })
        .reply(200, directExecutionResponseWithSnakeCasedCustomData);

      const response = await exh.tasks.functions.execute(
        functionName,
        directExecutionResponseWithSnakeCasedCustomData.data,
        {}
      );

      expect(response).toMatchObject({
        creationTimestamp: new Date(
          directExecutionResponseWithSnakeCasedCustomData.creationTimestamp
        ),
        updateTimestamp: new Date(
          directExecutionResponseWithSnakeCasedCustomData.updateTimestamp
        ),
        statusChangedTimestamp: new Date(
          directExecutionResponseWithSnakeCasedCustomData.statusChangedTimestamp
        ),
      });
    });
  });
});
