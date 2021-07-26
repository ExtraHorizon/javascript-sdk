import type { HttpInstance } from '../../types';
import { ObjectId, Results, AffectedRecords, PagedResult } from '../types';
import type {
  RegisterUserData,
  User,
  UserDataUpdate,
  Email,
  AddPatientEnlistment,
  ChangePassword,
  Authenticate,
  PasswordReset,
  ConfirmPassword,
  Patient,
  StaffMember,
  Hash,
  UsersService,
} from './types';
import type { RQLString } from '../../rql';

export default (userClient, httpWithAuth: HttpInstance): UsersService => ({
  async me(): Promise<User> {
    return (await userClient.get(httpWithAuth, '/me')).data;
  },

  async findById(userId: string): Promise<User> {
    return (await userClient.get(httpWithAuth, `/${userId}`)).data;
  },

  async update(userId: string, userData: UserDataUpdate): Promise<User> {
    return (await userClient.put(httpWithAuth, `/${userId}`, userData)).data;
  },

  async find(options?: { rql?: RQLString }): Promise<PagedResult<User>> {
    return (await userClient.get(httpWithAuth, `/${options?.rql || ''}`)).data;
  },

  async findFirst(options?: { rql?: RQLString }): Promise<User> {
    const res = await this.find(options);
    return res.data[0];
  },

  async removeUsers(rql: RQLString): Promise<AffectedRecords> {
    return (await userClient.delete(httpWithAuth, `/${rql}`)).data;
  },

  async patients(options?: { rql?: RQLString }): Promise<PagedResult<Patient>> {
    return (
      await userClient.get(httpWithAuth, `/patients${options?.rql || ''}`)
    ).data;
  },

  async staff(options?: {
    rql?: RQLString;
  }): Promise<PagedResult<StaffMember>> {
    return (await userClient.get(httpWithAuth, `/staff${options?.rql || ''}`))
      .data;
  },

  async remove(userId: ObjectId): Promise<AffectedRecords> {
    return (await userClient.delete(httpWithAuth, `/${userId}`)).data;
  },

  async updateEmail(userId: ObjectId, requestBody: Email): Promise<User> {
    return (await userClient.put(httpWithAuth, `/${userId}/email`, requestBody))
      .data;
  },

  async addPatientEnlistment(
    userId: ObjectId,
    requestBody: AddPatientEnlistment
  ): Promise<AffectedRecords> {
    return (
      await userClient.post(
        httpWithAuth,
        `/${userId}/patient_enlistments`,
        requestBody
      )
    ).data;
  },

  async removePatientEnlistment(
    userId: ObjectId,
    groupId: ObjectId
  ): Promise<AffectedRecords> {
    return (
      await userClient.delete(
        httpWithAuth,
        `/${userId}/patient_enlistments/${groupId}`
      )
    ).data;
  },

  async createAccount(requestBody: RegisterUserData): Promise<User> {
    return (await userClient.post(httpWithAuth, '/register', requestBody)).data;
  },

  async changePassword(requestBody: ChangePassword): Promise<User> {
    return (await userClient.put(httpWithAuth, '/password', requestBody)).data;
  },

  async authenticate(requestBody: Authenticate): Promise<User> {
    return (await userClient.post(httpWithAuth, '/authenticate', requestBody))
      .data;
  },

  async requestEmailActivation(email: string): Promise<boolean> {
    return (
      (
        await userClient.get(httpWithAuth, '/activation', {
          params: {
            email,
          },
        })
      ).status === Results.Success
    );
  },

  async validateEmailActivation(requestBody: Hash): Promise<boolean> {
    return (
      (await userClient.post(httpWithAuth, '/activation', requestBody))
        .status === Results.Success
    );
  },

  async requestPasswordReset(email: string): Promise<boolean> {
    return (
      (
        await userClient.get(httpWithAuth, '/forgot_password', {
          params: {
            email,
          },
        })
      ).status === Results.Success
    );
  },

  async validatePasswordReset(requestBody: PasswordReset): Promise<boolean> {
    const result = await userClient.post(
      httpWithAuth,
      '/forgot_password',
      requestBody
    );
    return result.status === Results.Success;
  },

  async confirmPassword(requestBody: ConfirmPassword): Promise<boolean> {
    const result = await userClient.post(
      httpWithAuth,
      '/confirm_password',
      requestBody
    );
    return result.status === Results.Success;
  },

  async isEmailAvailable(email: string): Promise<{
    emailAvailable: boolean;
  }> {
    return (
      await userClient.get(httpWithAuth, '/email_available', {
        params: {
          email,
        },
      })
    ).data;
  },

  async updateProfileImage(userId: ObjectId, requestBody: Hash): Promise<User> {
    console.warn('updateProfileImage method is deprecated in swagger');
    return (
      await userClient.put(
        httpWithAuth,
        `/${userId}/profile_image`,
        requestBody
      )
    ).data;
  },

  async deleteProfileImage(userId: ObjectId): Promise<User> {
    return (await userClient.delete(httpWithAuth, `/${userId}/profile_image`))
      .data;
  },
});
