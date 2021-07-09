export type MockClient<MockFn> = {
  users: {
    health: MockFn;
    me: MockFn;
    findById: MockFn;
    update: MockFn;
    find: MockFn;
    removeUsers: MockFn;
    patients: MockFn;
    staff: MockFn;
    remove: MockFn;
    updateEmail: MockFn;
    addPatientEnlistment: MockFn;
    removePatientEnlistment: MockFn;
    createAccount: MockFn;
    changePassword: MockFn;
    authenticate: MockFn;
    requestEmailActivation: MockFn;
    validateEmailActivation: MockFn;
    requestPasswordReset: MockFn;
    validatePasswordReset: MockFn;
    confirmPassword: MockFn;
    isEmailAvailable: MockFn;
    updateProfileImage: MockFn;
    deleteProfileImage: MockFn;
    groupRoles: {
      getPermissions: MockFn;
      get: MockFn;
      add: MockFn;
      update: MockFn;
      remove: MockFn;
      addPermissions: MockFn;
      removePermissions: MockFn;
      assignToStaff: MockFn;
      removeFromStaff: MockFn;
      addUsersToStaff: MockFn;
      removeUsersFromStaff: MockFn;
    };
    globalRoles: {
      getPermissions: MockFn;
      get: MockFn;
      create: MockFn;
      delete: MockFn;
      update: MockFn;
      addPermissions: MockFn;
      removePermissions: MockFn;
      addToUsers: MockFn;
      removeFromUser: MockFn;
    };
  };
  data: {
    health: MockFn;
    schemas: {
      create: MockFn;
      find: MockFn;
      findById: MockFn;
      findByName: MockFn;
      findFirst: MockFn;
      update: MockFn;
      delete: MockFn;
      disable: MockFn;
      enable: MockFn;
    };
    indexes: {
      create: MockFn;
      delete: MockFn;
    };
    statuses: {
      create: MockFn;
      update: MockFn;
      delete: MockFn;
    };
    properties: {
      create: MockFn;
      delete: MockFn;
      update: MockFn;
    };
    comments: {
      create: MockFn;
      find: MockFn;
      findById: MockFn;
      findFirst: MockFn;
      update: MockFn;
      delete: MockFn;
    };
    documents: {
      assertNonLockedState: MockFn;
      create: MockFn;
      find: MockFn;
      findById: MockFn;
      findFirst: MockFn;
      update: MockFn;
      delete: MockFn;
      deleteFields: MockFn;
      transition: MockFn;
      linkGroups: MockFn;
      unlinkGroups: MockFn;
      linkUsers: MockFn;
      unlinkUsers: MockFn;
    };
    transitions: {
      updateCreation: MockFn;
      create: MockFn;
      update: MockFn;
      delete: MockFn;
    };
  };
  files: {
    find: MockFn;
    findByName: MockFn;
    findFirst: MockFn;
    createFromText: MockFn;
    create: MockFn;
    delete: MockFn;
    retrieve: MockFn;
    retrieveStream: MockFn;
    getDetails: MockFn;
    deleteToken: MockFn;
    generateToken: MockFn;
  };
  tasks: {
    find: MockFn;
    findById: MockFn;
    findFirst: MockFn;
    create: MockFn;
    cancel: MockFn;
  };
  templates: {
    health: MockFn;
    find: MockFn;
    findById: MockFn;
    findByName: MockFn;
    findFirst: MockFn;
    create: MockFn;
    update: MockFn;
    delete: MockFn;
    resolveAsPdf: MockFn;
    resolveAsPdfUsingCode: MockFn;
    resolveAsJson: MockFn;
    resolveAsJsonUsingCode: MockFn;
  };
  mails: {
    health: MockFn;
    find: MockFn;
    findById: MockFn;
    findFirst: MockFn;
    send: MockFn;
    track: MockFn;
    findOutbound: MockFn;
  };
  configurations: {
    general: {
      get: MockFn;
      update: MockFn;
      removeFields: MockFn;
    };
    groups: {
      get: MockFn;
      update: MockFn;
      removeFields: MockFn;
    };
    users: {
      get: MockFn;
      update: MockFn;
      removeFields: MockFn;
    };
    patients: {
      update: MockFn;
      removeFields: MockFn;
    };
    staff: {
      update: MockFn;
      removeFields: MockFn;
    };
  };
  dispatchers: {
    find: MockFn;
    findById: MockFn;
    findFirst: MockFn;
    create: MockFn;
    remove: MockFn;
    actions: {
      create: MockFn;
      update: MockFn;
      delete: MockFn;
    };
  };
  payments: {
    health: MockFn;
    products: {
      create: MockFn;
      find: MockFn;
      findById: MockFn;
      findFirst: MockFn;
      addTagsToProduct: MockFn;
      removeTagsFromProduct: MockFn;
      update: MockFn;
      remove: MockFn;
    };
    orders: {
      find: MockFn;
      findById: MockFn;
      findFirst: MockFn;
      create: MockFn;
      update: MockFn;
      addTagsToOrder: MockFn;
      removeTagsFromOrder: MockFn;
    };
    subscriptions: {
      getEntitlements: MockFn;
      getEvents: MockFn;
    };
    appStore: {
      createTransaction: MockFn;
      verifyTransaction: MockFn;
      processNotification: MockFn;
      getNotifications: MockFn;
      getReceipts: MockFn;
    };
    appStoreSubscriptions: {
      getSubscriptions: MockFn;
      getSubscriptionsProducts: MockFn;
      createSubscriptionsProduct: MockFn;
      removeSubscriptionsProduct: MockFn;
      updateSubscriptionsProduct: MockFn;
    };
    stripe: {
      getUser: MockFn;
      savePaymentMethod: MockFn;
      addTagsToPaymentMethod: MockFn;
      removeTagsToPaymentMethod: MockFn;
      removePaymentMethod: MockFn;
      createPaymentIntent: MockFn;
      createSetupIntent: MockFn;
      subscribeToEvents: MockFn;
    };
  };
  localizations: {
    health: MockFn;
    find: MockFn;
    findByKey: MockFn;
    findFirst: MockFn;
    create: MockFn;
    update: MockFn;
    remove: MockFn;
    getByKeys: MockFn;
    getCountries: MockFn;
    getRegions: MockFn;
    getLanguages: MockFn;
  };
  profiles: {
    health: MockFn;
    find: MockFn;
    findById: MockFn;
    findFirst: MockFn;
    create: MockFn;
    update: MockFn;
    removeFields: MockFn;
    getComorbidities: MockFn;
    getImpediments: MockFn;
    groups: {
      create: MockFn;
      update: MockFn;
      remove: MockFn;
      removeFields: MockFn;
    };
    logs: {
      create: MockFn;
      find: MockFn;
      update: MockFn;
      remove: MockFn;
    };
  };
  notifications: {
    health: MockFn;
    create: MockFn;
    find: MockFn;
    findById: MockFn;
    findFirst: MockFn;
    remove: MockFn;
    markAsViewed: MockFn;
    getTypes: MockFn;
    settings: {
      find: MockFn;
      findById: MockFn;
      findFirst: MockFn;
      update: MockFn;
      remove: MockFn;
    };
  };
  events: {
    health: MockFn;
    find: MockFn;
    findById: MockFn;
    findFirst: MockFn;
    create: MockFn;
    subscriptions: {
      find: MockFn;
      findById: MockFn;
      findFirst: MockFn;
      create: MockFn;
    };
  };
  auth: {
    applications: {
      create: MockFn;
      get: MockFn;
      update: MockFn;
      delete: MockFn;
      createVersion: MockFn;
      deleteVersion: MockFn;
    };
    oauth2: {
      createAuthorization: MockFn;
      getAuthorizations: MockFn;
      deleteAuthorization: MockFn;
    };
    users: {
      getMfaSetting: MockFn;
      enableMfa: MockFn;
      disableMfa: MockFn;
      addMfaMethod: MockFn;
      confirmMfaMethodVerification: MockFn;
      removeMfaMethod: MockFn;
    };
    confirmPresence: MockFn;
    health: MockFn;
    authenticate: MockFn;
    confirmMfa: MockFn;
  };
  raw: {
    get: MockFn;
    post: MockFn;
    put: MockFn;
    patch: MockFn;
    delete: MockFn;
    request: MockFn;
    all: MockFn;
    head: MockFn;
    options: MockFn;
  };
};
