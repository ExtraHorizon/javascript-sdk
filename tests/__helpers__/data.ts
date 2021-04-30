import {
  CreateMode,
  ReadMode,
  UpdateMode,
  DeleteMode,
  GroupSyncMode,
  IndexFieldsType,
} from '../../src/services/data/types';

export const newSchemaInput = {
  name: 'Fibricheck measurement',
  description: 'The schema for holding FibriCheck measurements',
  createMode: CreateMode.DEFAULT,
  readMode: ReadMode.ALL_USERS,
  updateMode: UpdateMode.DEFAULT,
  deleteMode: DeleteMode.PERMISSION_REQUIRED,
  groupSyncMode: GroupSyncMode.DISABLED,
  defaultLimit: 5,
  maximumLimit: 5,
};

export const newSchemaCreated = {
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
          min: -180,
          max: 180,
        },
        latitude: {
          type: 'number',
          min: -90,
          max: 90,
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
  createMode: 'default',
  readMode: 'allUsers',
  updateMode: 'default',
  deleteMode: 'permissionRequired',
  groupSyncMode: 'disabled',
  defaultLimit: 5,
  maximumLimit: 5,
  updateTimestamp: '2021-04-20T07:34:08.358Z',
  creationTimestamp: '2021-04-20T07:34:08.358Z',
};

export const schemasListResponse = {
  query: '{}',
  page: {
    total: 1,
    offset: 0,
    limit: 20,
  },
  data: [
    {
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
              min: -180,
              max: 180,
            },
            latitude: {
              type: 'number',
              min: -90,
              max: 90,
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
      createMode: 'default',
      readMode: 'allUsers',
      updateMode: 'default',
      deleteMode: 'permissionRequired',
      groupSyncMode: 'disabled',
      defaultLimit: 'Default limit for returning items',
      maximumLimit: 'Default maximum limit for returning items',
      updateTimestamp: '2021-04-21T21:37:14.798Z',
      creationTimestamp: '2021-04-21T21:37:14.798Z',
    },
  ],
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

export const newIndexInput = {
  fields: [
    {
      name: 'PropertyNameToIndex',
      type: IndexFieldsType.ASC,
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

export const commentsListResponse = {
  query: '{}',
  page: {
    total: 1,
    offset: 0,
    limit: 20,
  },
  data: [
    {
      id: '5e9fff9d90135a2a9a718e2f',
      schemaId: '5e9fff9d90135a2a9a718e2f',
      measurementId: '5e9fff9d90135a2a9a718e2f',
      userId: '5e9fff9d90135a2a9a718e2f',
      text: 'Your comment here',
      updateTimestamp: '2021-04-30T08:08:11.948Z',
      creationTimestamp: '2021-04-30T08:08:11.948Z',
    },
  ],
};
