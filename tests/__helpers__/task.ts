export const taskData = {
  id: '757f191a810c19729de860ae',
  status: 'new',
  statusChangedTimestamp: new Date('2021-04-22T14:29:45.586Z'),
  functionName: 'testFunction',
  data: {
    key: 'value',
  },
  startTimestamp: new Date('2021-04-22T14:29:45.586Z'),
  tags: ['string'],
  priority: 1,
  creationTimestamp: new Date('2021-04-22T14:29:45.586Z'),
  updateTimestamp: new Date('2021-04-22T14:29:45.586Z'),
};

export interface InputType {
  propertyOne: string;
  propertyTwo: string;
  propertyThree: string;
}

export interface OutputType {
  propertyOne: string;
  propertyTwo: string;
  propertyThree: string;
}

export const directExecutionResponse = {
  id: '757f191a810c19729de860ae',
  status: 'new',
  statusChangedTimestamp: new Date('2023-07-03T14:14:50.698Z'),
  functionName: 'test',
  data: {
    propertyOne: 'value',
    propertyTwo: 'value',
    propertyThree: 'value',
  },
  startTimestamp: new Date('2023-07-03T14:14:50.698Z'),
  tags: ['nightly', 'test'],
  priority: 1,
  creationTimestamp: new Date('2023-07-03T14:14:50.698Z'),
  updateTimestamp: new Date('2023-07-03T14:14:50.698Z'),
  createdByApplicationId: '757f191a810c19729de860ae',
  createdByUserId: '757f191a810c19729de860ae',
  result: {
    propertyOne: 'value',
    propertyTwo: 'value',
    propertyThree: 'value',
  },
};
