// eslint-disable-next-line import/no-extraneous-dependencies
import nock from 'nock';
import { createClient } from '../../../src';
import { TASKS_BASE } from '../../../src/constants';
import {
  directExecutionResponse,
  InputType,
  OutputType,
} from '../../__helpers__/task';

describe('Tasks - Functions - Execute', () => {
  const host = 'https://api.xxx.extrahorizon.com';
  const functionName = 'test';

  const exh = createClient({
    host,
    clientId: '',
  });

  const data = {
    propertyOne: 'value',
    propertyTwo: 'value',
    propertyThree: 'value',
  };

  it('Executes a request towards a Function', async () => {
    nock(`${host}${TASKS_BASE}`)
      .post(`/functions/${functionName}/execute`, { data })
      .reply(200, directExecutionResponse);

    const response = await exh.tasks.execute(functionName, data, {});
    expect(response).toMatchObject(directExecutionResponse);

    expect(response.data.propertyOne).toBeDefined();
    expect(response.result.propertyOne).toBeDefined();
  });

  it('Executes a request towards a Function with custom input and output interfaces', async () => {
    nock(`${host}${TASKS_BASE}`)
      .post(`/functions/${functionName}/execute`, { data })
      .reply(200, directExecutionResponse);

    const response = await exh.tasks.execute<OutputType, InputType>(
      functionName,
      data,
      {}
    );
    expect(response.data.propertyOne).toBeDefined();
    expect(response.result.propertyOne).toBeDefined();
  });
});
