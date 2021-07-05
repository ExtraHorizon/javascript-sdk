import { userData, permissionData, roleData } from './user';
import { fileData } from './file';

export const emptyPagedResult = {
  page: {
    total: 0,
    offset: 0,
    limit: 20,
  },
  data: [],
};

export const userResponse = {
  page: {
    total: 1,
    offset: 0,
    limit: 20,
  },
  data: [userData],
};

export const patientsResponse = {
  page: {
    total: 1,
    offset: 0,
    limit: 20,
  },
  data: [userData],
};

export const staffResponse = {
  page: {
    total: 1,
    offset: 0,
    limit: 20,
  },
  data: [userData],
};

export const permissionResponse = {
  page: {
    total: 1,
    offset: 0,
    limit: 0,
  },
  data: [permissionData],
};

export const roleResponse = {
  page: {
    total: 1,
    offset: 0,
    limit: 20,
  },
  data: [roleData],
};

export const filesResponse = {
  page: {
    total: 1,
    offset: 0,
    limit: 20,
  },
  data: [fileData],
};
