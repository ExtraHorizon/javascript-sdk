import { randomHexString } from './utils';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface UserResponse {
  user: User;
}

export interface UsersResponse {
  users: User[];
}

export const randomUser = (): User => ({
  id: randomHexString(),
  name: '',
  email: `${randomHexString()}@${randomHexString()}.com`,
});

export const userData: User[] = [
  randomUser(),
  randomUser(),
  randomUser(),
  randomUser(),
  randomUser(),
];
