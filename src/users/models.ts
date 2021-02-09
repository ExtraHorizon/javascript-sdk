/* eslint-disable camelcase */
export interface UserData {
  id:string,
  firstName: string,
  lastName: string,
  language: string,
  timeZone: string,
  email: string,
  phoneNumber:string,
  activation: boolean,
  patientEnlistments: [],
  roles: []
  staffEnlistments: [],
  lastFailedTimestamp: number,
  failedCount: number,
  creationTimestamp: number,
  updateTimestamp: number,
  profileImage: string
}
