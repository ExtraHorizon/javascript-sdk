
import { userData } from './user';

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
 data: [
  userData,
 ],
};
