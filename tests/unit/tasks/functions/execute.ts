// eslint-disable-next-line import/no-extraneous-dependencies
import nock from 'nock';
import { createClient } from '../../../../src';
import { TASKS_BASE } from '../../../../src/constants';
import {
  directExecutionResponse,
  InputType,
  OutputType,
} from '../../../__helpers__/task';

describe('Tasks - Functions - Execute', () => {
  const host = 'https://api.xxx.extrahorizon.com';
  const functionName = 'test';

  const exh = createClient({
    host,
    clientId: '',
  });

  const data = {
    input_one: 'value',
    inputTwo: 'value',
    input_three: 'value',
  };

  it('Executes a request towards a Function', async () => {
    nock(`${host}${TASKS_BASE}`)
      .post(`/functions/${functionName}/execute`, { data })
      .reply(200, directExecutionResponse);

    const response = await exh.tasks.functions.execute(functionName, data, {});
    expect(response).toMatchObject(directExecutionResponse);
  });

  it('Executes a request towards a Function with custom input and output interfaces', async () => {
    nock(`${host}${TASKS_BASE}`)
      .post(`/functions/${functionName}/execute`, { data })
      .reply(200, directExecutionResponse);

    const response = await exh.tasks.functions.execute<OutputType, InputType>(
      functionName,
      data,
      {}
    );

    expect(response.data.input_one).toBeDefined();
    expect(response.data.inputTwo).toBeDefined();
    expect(response.result.output_one).toBeDefined();
    expect(response.result.outputTwo).toBeDefined();
  });

  it('Should not transform custom data in execution responses', async () => {
    nock(`${host}${TASKS_BASE}`)
      .post(`/functions/${functionName}/execute`, { data })
      .reply(200, directExecutionResponse);

    const response = await exh.tasks.functions.execute<OutputType, InputType>(
      functionName,
      data,
      {}
    );

    expect(response).toStrictEqual({
      ...directExecutionResponse,
      creationTimestamp: new Date(directExecutionResponse.creationTimestamp),
      updateTimestamp: new Date(directExecutionResponse.updateTimestamp),
      statusChangedTimestamp: new Date(
        directExecutionResponse.statusChangedTimestamp
      ),
      startTimestamp: new Date(directExecutionResponse.startTimestamp),
    });
  });
});
