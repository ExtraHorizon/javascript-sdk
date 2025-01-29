import {
  Condition,
  CreationTransition,
  Index,
  Schema,
  SchemaInput,
  TransitionInput,
} from '../../src/services/data/types';

export const newSchemaInput: SchemaInput = {
  name: 'Fibricheck measurement',
  description: 'The schema for holding FibriCheck measurements',
  createMode: 'allUsers',
  readMode: ['linkedUsers', 'linkedGroupStaff'],
  updateMode: ['linkedUsers', 'linkedGroupStaff'],
  deleteMode: 'permissionRequired',
  groupSyncMode: 'disabled',
  defaultLimit: 5,
  maximumLimit: 5,
};

export const newSchemaCreated: Partial<Schema> = {
  id: '5e9fff9d90135a2a9a718e2f',
  name: 'FibriCheck Measurement',
  description: 'The schema for holding FibriCheck measurements',
  properties: {
    ppg: {
      type: 'array',
      maxItems: 2000,
      items: {
        type: 'number',
        maximum: 255,
      },
    },
    location: {
      type: 'object',
      properties: {
        longitude: {
          type: 'number',
          minimum: -180,
          maximum: 180,
        },
        latitude: {
          type: 'number',
          minimum: -90,
          maximum: 90,
        },
      },
    },
  },
  statuses: {
    // start: {},
  },
  creationTransition: {
    toStatus: 'start',
    type: 'manual',
    conditions: [
      {
        type: 'input',
        configuration: {
          type: 'number',
          minimum: -180,
          maximum: 180,
        },
      },
      {
        type: 'document',
        configuration: {
          type: 'number',
          minimum: -180,
          maximum: 180,
        },
      },
      {
        type: 'initiatorHasRelationToUserInData',
        userIdField: '5e9fff9d90135a2a9a718e2f',
        relation: 'isStaffOfTargetPatient',
      },
      {
        type: 'initiatorHasRelationToGroupInData',
        groupIdField: '5e9fff9d90135a2a9a718e2f',
        relation: 'staff',
        requiredPermission: 'MY_PERMISSION',
      },
    ],
    actions: [
      {
        type: 'task',
        functionName: 'test',
        data: {},
      },
    ],
    afterActions: [
      {
        type: 'notifyAlgoQueueManager',
      },
    ],
  },
  transitions: [
    {
      id: '1',
      toStatus: 'start',
      type: 'manual',
      conditions: [
        {
          type: 'input',
          configuration: {
            type: 'number',
            minimum: -180,
            maximum: 180,
          },
        },
        {
          type: 'document',
          configuration: {
            type: 'number',
            minimum: -180,
            maximum: 180,
          },
        },
        {
          type: 'initiatorHasRelationToUserInData',
          userIdField: '5e9fff9d90135a2a9a718e2f',
          relation: 'isStaffOfTargetPatient',
        },
        {
          type: 'initiatorHasRelationToGroupInData',
          groupIdField: '5e9fff9d90135a2a9a718e2f',
          relation: 'staff',
          requiredPermission: 'MY_PERMISSION',
        },
      ],
      actions: [
        {
          type: 'linkCreator',
        },
      ],
      afterActions: [],
      name: 'move',
      fromStatuses: ['start'],
    },
  ],
  createMode: 'allUsers',
  readMode: ['linkedUsers', 'linkedGroupStaff'],
  updateMode: ['linkedUsers', 'linkedGroupStaff'],
  deleteMode: 'permissionRequired',
  groupSyncMode: 'disabled',
  defaultLimit: 5,
  maximumLimit: 5,
  updateTimestamp: new Date('2021-04-20T07:34:08.358Z'),
  creationTimestamp: new Date('2021-04-20T07:34:08.358Z'),
};

export const schemaData = {
  id: '5e9fff9d90135a2a9a718e2f',
  name: 'FibriCheck Measurement',
  description: 'The schema for holding FibriCheck measurements',
  properties: {
    ppg: {
      type: 'array',
      max: 2000,
      items: {
        type: 'number',
        max: 255,
      },
    },
    location: {
      type: 'object',
      properties: {
        longitude: {
          type: 'number',
          minimum: -180,
          maximum: 180,
        },
        latitude: {
          type: 'number',
          minimum: -90,
          maximum: 90,
        },
      },
    },
  },
  statuses: {
    start: {},
  },
  creationTransition: {
    toStatus: 'start',
    type: 'manual',
    conditions: [
      {
        type: 'input',
        configuration: {
          type: 'number',
          minimum: -180,
          maximum: 180,
        },
      },
      {
        type: 'document',
        configuration: {
          type: 'number',
          minimum: -180,
          maximum: 180,
        },
      },
      {
        type: 'initiatorHasRelationToUserInData',
        userIdField: '5e9fff9d90135a2a9a718e2f',
        relation: 'isStaffOfTargetPatient',
      },
      {
        type: 'initiatorHasRelationToGroupInData',
        groupIdField: '5e9fff9d90135a2a9a718e2f',
        relation: 'staff',
        requiredPermission: 'MY_PERMISSION',
      },
    ],
    actions: [
      {
        type: 'algorithm',
      },
    ],
    afterActions: [
      {
        type: 'notifyAlgoQueueManager',
      },
    ],
  },
  transitions: [
    {
      id: '5e9fff9d84820a2a9a718e2f',
      toStatus: 'start',
      type: 'manual',
      conditions: [
        {
          type: 'input',
          configuration: {
            type: 'number',
            minimum: -180,
            maximum: 180,
          },
        },
        {
          type: 'document',
          configuration: {
            type: 'number',
            minimum: -180,
            maximum: 180,
          },
        },
        {
          type: 'initiatorHasRelationToUserInData',
          userIdField: '5e9fff9d90135a2a9a718e2f',
          relation: 'isStaffOfTargetPatient',
        },
        {
          type: 'initiatorHasRelationToGroupInData',
          groupIdField: '5e9fff9d90135a2a9a718e2f',
          relation: 'staff',
          requiredPermission: 'MY_PERMISSION',
        },
      ],
      actions: [
        {
          type: 'algorithm',
        },
      ],
      afterActions: [
        {
          type: 'notifyAlgoQueueManager',
        },
      ],
      name: 'move',
      fromStatuses: ['start'],
    },
  ],
  createMode: 'allUsers',
  readMode: ['linkedUsers', 'linkedGroupStaff'],
  updateMode: ['linkedUsers', 'linkedGroupStaff'],
  deleteMode: 'permissionRequired',
  groupSyncMode: 'disabled',
  defaultLimit: 'Default limit for returning items',
  maximumLimit: 'Default maximum limit for returning items',
  updateTimestamp: '2021-04-21T21:37:14.798Z',
  creationTimestamp: '2021-04-21T21:37:14.798Z',
};

export const newIndexCreated = {
  id: '5e9fff9d90135a2a9a718e2f',
  name: 'location',
  fields: [
    {
      name: 'PropertyNameToIndex',
      type: 'asc',
    },
  ],
  options: {
    background: true,
    unique: true,
    sparse: true,
  },
  system: true,
};

export const newIndexInput: Omit<Index, 'id' | 'name'> = {
  fields: [
    {
      name: 'PropertyNameToIndex',
      type: 'asc',
    },
  ],
  options: {
    unique: true,
    sparse: true,
  },
};

export const newCommentCreated = {
  id: '5e9fff9d90135a2a9a718e2f',
  schemaId: '5e9fff9d90135a2a9a718e2f',
  measurementId: '5e9fff9d90135a2a9a718e2f',
  userId: '5e9fff9d90135a2a9a718e2f',
  text: 'Your comment here',
  updateTimestamp: '2021-04-30T08:08:11.940Z',
  creationTimestamp: '2021-04-30T08:08:11.940Z',
};

export const commentData = {
  id: '5e9fff9d90135a2a9a718e2f',
  schemaId: '5e9fff9d90135a2a9a718e2f',
  measurementId: '5e9fff9d90135a2a9a718e2f',
  userId: '5e9fff9d90135a2a9a718e2f',
  text: 'Your comment here',
  updateTimestamp: '2021-04-30T08:08:11.948Z',
  creationTimestamp: '2021-04-30T08:08:11.948Z',
};

export const newDocumentCreated = {
  id: '5e9fff9d90135a2a9a718e2f',
  userId: '5e9fff9d90135a2a9a718e2f',
  groupIds: ['5e9fff9d90135a2a9a718e2f'],
  status: 'start',
  data: {
    additionalProp1: {},
    additionalProp2: {},
    additionalProp3: {},
  },
  transitionLock: {
    timestamp: '2021-04-29T21:07:45.544Z',
  },
  commentCount: 5,
  updateTimestamp: '2021-04-29T21:07:45.544Z',
  creationTimestamp: '2021-04-29T21:07:45.544Z',
};

export const documentData = {
  id: '5e9fff9d90135a2a9a718e2f',
  userId: '5e9fff9d90135a2a9a718e2f',
  groupIds: ['5e9fff9d90135a2a9a718e2f'],
  status: 'start',
  data: {
    additionalProp1: {},
    additionalProp2: {},
    additionalProp3: {},
  },
  commentCount: 5,
  updateTimestamp: '2021-04-29T21:07:45.551Z',
  creationTimestamp: '2021-04-29T21:07:45.551Z',
};

export const lockedDocumentData = {
  id: '5e9fff9d90135a2a9a718e2f',
  userId: '5e9fff9d90135a2a9a718e2f',
  groupIds: ['5e9fff9d90135a2a9a718e2f'],
  status: 'start',
  data: {
    additionalProp1: {},
    additionalProp2: {},
    additionalProp3: {},
  },
  transitionLock: {
    timestamp: '2021-04-29T21:07:45.551Z',
  },
  commentCount: 5,
  updateTimestamp: '2021-04-29T21:07:45.551Z',
  creationTimestamp: '2021-04-29T21:07:45.551Z',
};

const inputCondition: Condition = {
  type: 'input',
  configuration: {
    type: 'number',
    minimum: -180,
    maximum: 180,
  },
};

const documentCondition: Condition = {
  type: 'document',
  configuration: {
    type: 'number',
    minimum: -180,
    maximum: 180,
  },
};

export const transitionInput: CreationTransition = {
  toStatus: 'start',
  type: 'manual',
  conditions: [inputCondition, documentCondition],
};

export const newTransition: TransitionInput = {
  toStatus: 'start',
  type: 'manual',
  conditions: [inputCondition, documentCondition],
  actions: [
    {
      type: 'linkCreator',
    },
  ],
  afterActions: [
    {
      type: 'notifyAlgoQueueManager',
    },
  ],
  name: 'move',
  fromStatuses: ['start'],
};
