import {
  Schedule,
  ScheduleCreation,
} from '../../src/services/tasks/schedules/types';

export type ScheduleDataType = { firstName: string; lastName: string };

export const scheduleCreation: ScheduleCreation<ScheduleDataType> = {
  interval: 10000,
  functionName: 'up-town-func',
  startTimestamp: new Date('2420-04-20T00:00:00.001Z'),
  data: { firstName: 'Barney', lastName: 'Stinson' },
  priority: 1,
};

export const schedulesData: Schedule[] = [
  {
    id: '64ad169e4d29c1b246ee25df',
    interval: 12345,
    functionName: 'the-func',
    data: { firstName: 'Marshall', lastName: 'Eriksen' },
    startTimestamp: new Date('2023-07-01T00:00:00.001Z'),
    nextTimestamp: new Date('2023-07-02T08:45:28.647Z'),
    updateTimestamp: new Date('2023-07-01T08:45:28.647Z'),
    creationTimestamp: new Date('2023-07-01T08:45:18.881Z'),
  },
  {
    id: '64ad1a746ff6826e6f8fc8ac',
    interval: 54321,
    functionName: 'the-whole-func',
    startTimestamp: new Date('2023-07-02T00:00:00.001Z'),
    nextTimestamp: new Date('2023-07-03T00:00:00.001Z'),
    updateTimestamp: new Date('2023-07-02T00:00:00.001Z'),
    creationTimestamp: new Date('2023-07-02T00:00:00.001Z'),
  },
  {
    id: '64ad1a7c86267946f42f844d',
    interval: 98765,
    functionName: 'and-nothing',
    data: { firstName: 'Ted', lastName: 'Mosby' },
    startTimestamp: new Date('2023-07-03T00:00:00.001Z'),
    nextTimestamp: new Date('2023-07-04T00:00:00.001Z'),
    updateTimestamp: new Date('2023-07-03T00:00:00.001Z'),
    creationTimestamp: new Date('2023-07-03T00:00:00.001Z'),
  },
  {
    id: '64ad1a82dec5d33794c88a00',
    interval: 56789,
    functionName: 'but-the-func',
    startTimestamp: new Date('2023-07-11T00:00:00.001Z'),
    nextTimestamp: new Date('2023-07-12T00:00:00.001Z'),
    updateTimestamp: new Date('2023-07-11T00:00:00.001Z'),
    creationTimestamp: new Date('2023-07-11T00:00:00.001Z'),
  },
];
