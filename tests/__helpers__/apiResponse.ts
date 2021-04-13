import { userData, permissionData, roleData } from './user';

export const emptyListResponse = {
  query: {},
  page: {
    total: 0,
    offset: 0,
    limit: 20,
  },
  data: [],
};

export const userResponse = {
  query: '{}',
  page: {
    total: 1,
    offset: 0,
    limit: 20,
  },
  data: [userData],
};

export const patientsResponse = [userData];

export const staffResponse = [userData];

export const permissionResponse = {
  page: {
    total: 1,
    offset: 0,
    limit: 0,
  },
  data: [permissionData],
};

export const roleResponse = {
  query: {},
  page: {
    total: 1,
    offset: 0,
    limit: 20,
  },
  data: [roleData],
};
