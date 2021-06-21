import {
  CreateMode,
  ReadMode,
  UpdateMode,
  DeleteMode,
  GroupSyncMode,
  IndexFieldsType,
  CreationTransitionType,
  ConfigurationType,
  Condition,
  Transition,
  CreationTransitionAction,
  CreationTransitionAfterAction,
  CreationTransition,
  Schema,
  InitiatorHasRelationToUserInDataConditionType,
  InitiatorHasRelationToUserInDataConditionRelation,
  InitiatorHasRelationToGroupInDataConditionType,
  InitiatorHasRelationToGroupInDataConditionRelation,
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

export const newSchemaCreated: Partial<Schema> = {
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
    // start: {},
  },
  creationTransition: {
    toStatus: 'start',
    type: CreationTransitionType.MANUAL,
    conditions: [
      {
        type: ConfigurationType.INPUT,
        configuration: {
          type: ConfigurationType.NUMBER,
          minimum: -180,
          maximum: 180,
        },
      },
      {
        type: ConfigurationType.DOCUMENT,
        configuration: {
          type: ConfigurationType.NUMBER,
          minimum: -180,
          maximum: 180,
        },
      },
      {
        type:
          InitiatorHasRelationToUserInDataConditionType.INITIATOR_HAS_RELATION_TO_USER_IN_DATA,
        userIdField: '5e9fff9d90135a2a9a718e2f',
        relation:
          InitiatorHasRelationToUserInDataConditionRelation.IS_STAFF_OF_TARGET_PATIENT,
      },
      {
        type:
          InitiatorHasRelationToGroupInDataConditionType.INITIATOR_HAS_RELATION_TO_GROUP_IN_DATA,
        groupIdField: '5e9fff9d90135a2a9a718e2f',
        relation: InitiatorHasRelationToGroupInDataConditionRelation.STAFF,
        requiredPermission: 'MY_PERMISSION',
      },
    ],
    actions: [
      {
        type: CreationTransitionAction.ALGORITHM,
      },
    ],
    afterActions: [
      {
        type: CreationTransitionAfterAction.NOTIFY_ALGO_QUEUE_MANAGER,
      },
    ],
  },
  transitions: [
    {
      toStatus: 'start',
      type: CreationTransitionType.MANUAL,
      conditions: [
        {
          type: ConfigurationType.INPUT,
          configuration: {
            type: ConfigurationType.NUMBER,
            minimum: -180,
            maximum: 180,
          },
        },
        {
          type: ConfigurationType.DOCUMENT,
          configuration: {
            type: ConfigurationType.NUMBER,
            minimum: -180,
            maximum: 180,
          },
        },
        {
          type:
            InitiatorHasRelationToUserInDataConditionType.INITIATOR_HAS_RELATION_TO_USER_IN_DATA,
          userIdField: '5e9fff9d90135a2a9a718e2f',
          relation:
            InitiatorHasRelationToUserInDataConditionRelation.IS_STAFF_OF_TARGET_PATIENT,
        },
        {
          type:
            InitiatorHasRelationToGroupInDataConditionType.INITIATOR_HAS_RELATION_TO_GROUP_IN_DATA,
          groupIdField: '5e9fff9d90135a2a9a718e2f',
          relation: InitiatorHasRelationToGroupInDataConditionRelation.STAFF,
          requiredPermission: 'MY_PERMISSION',
        },
      ],
      actions: [
        {
          type: CreationTransitionAction.ALGORITHM,
        },
      ],
      afterActions: [
        {
          type: CreationTransitionAfterAction.NOTIFY_ALGO_QUEUE_MANAGER,
        },
      ],
      name: 'move',
      fromStatuses: ['start'],
    },
  ],
  createMode: CreateMode.DEFAULT,
  readMode: ReadMode.ALL_USERS,
  updateMode: UpdateMode.DEFAULT,
  deleteMode: DeleteMode.PERMISSION_REQUIRED,
  groupSyncMode: GroupSyncMode.DISABLED,
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
  createMode: 'default',
  readMode: 'allUsers',
  updateMode: 'default',
  deleteMode: 'permissionRequired',
  groupSyncMode: 'disabled',
  defaultLimit: 'Default limit for returning items',
  maximumLimit: 'Default maximum limit for returning items',
  updateTimestamp: '2021-04-21T21:37:14.798Z',
  creationTimestamp: '2021-04-21T21:37:14.798Z',
};

export const schemasListResponse = {
  page: {
    total: 1,
    offset: 0,
    limit: 20,
  },
  data: [schemaData],
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

export const commentData = {
  id: '5e9fff9d90135a2a9a718e2f',
  schemaId: '5e9fff9d90135a2a9a718e2f',
  measurementId: '5e9fff9d90135a2a9a718e2f',
  userId: '5e9fff9d90135a2a9a718e2f',
  text: 'Your comment here',
  updateTimestamp: '2021-04-30T08:08:11.948Z',
  creationTimestamp: '2021-04-30T08:08:11.948Z',
};

export const commentsListResponse = {
  page: {
    total: 1,
    offset: 0,
    limit: 20,
  },
  data: [commentData],
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

export const documentsListResponse = {
  page: {
    total: 1,
    offset: 0,
    limit: 20,
  },
  data: [documentData],
};

export const lockedDocumentsListResponse = {
  page: {
    total: 1,
    offset: 0,
    limit: 20,
  },
  data: [lockedDocumentData],
};

const inputCondition: Condition = {
  type: ConfigurationType.INPUT,
  configuration: {
    type: ConfigurationType.NUMBER,
    minimum: -180,
    maximum: 180,
  },
};

const documentCondition: Condition = {
  type: ConfigurationType.DOCUMENT,
  configuration: {
    type: ConfigurationType.NUMBER,
    minimum: -180,
    maximum: 180,
  },
};

export const transitionInput: CreationTransition = {
  toStatus: 'start',
  type: CreationTransitionType.MANUAL,
  conditions: [inputCondition, documentCondition],
};

export const newTransition: Transition = {
  toStatus: 'start',
  type: CreationTransitionType.MANUAL,
  conditions: [inputCondition, documentCondition],
  actions: [
    {
      type: CreationTransitionAction.ALGORITHM,
    },
  ],
  afterActions: [
    {
      type: CreationTransitionAfterAction.NOTIFY_ALGO_QUEUE_MANAGER,
    },
  ],
  name: 'move',
  fromStatuses: ['start'],
};
