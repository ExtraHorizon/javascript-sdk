import { fileData } from './file';

export const emptyPagedResult = {
  page: {
    total: 0,
    offset: 0,
    limit: 20,
  },
  data: [],
};

export const filesResponse = {
  page: {
    total: 1,
    offset: 0,
    limit: 20,
  },
  data: [fileData],
};
