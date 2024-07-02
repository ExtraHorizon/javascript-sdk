import nock from 'nock';
import { createClient } from '../../../../src';
import { TASKS_BASE } from '../../../../src/constants';
import {
  directExecutionResponse,
  directExecutionResponseWithSnakeCasedCustomData,
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

  it('Should not transform custom data in execution responses', async () => {
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

  it('Should transform Extra Horizon timestamps to date objects', async () => {
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
