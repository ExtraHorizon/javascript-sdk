export const userData = {
  "id": "5a0b2adc265ced65a8cab865",
  "first_name": "test",
  "last_name": "test",
  "language": "NL",
  "email": "test@test.test",
  "phone_number": "0123456789",
  "activation": false,
  "last_failed_timestamp": 1588890782006,
  "failed_count": 10,
  "creation_timestamp": 1510681308855,
  "update_timestamp": 1588890782006
};

export const updatedUserData = {
  "id": "5a0b2adc265ced65a8cab865",
  "first_name": "testje",
  "last_name": "testje",
  "language": "NL",
  "email": "testje@testje.testje",
  "phone_number": "0123456789",
  "activation": false,
  "last_failed_timestamp": 1588890782006,
  "failed_count": 10,
  "creation_timestamp": 1510681308855,
  "update_timestamp": 1588890782006
};

export const newUserData = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  password: "string",
  phoneNumber: "7692837456",
  birthday: "1969-06-20",
  gender: 1,
  country: "NL",
  region: "NL-GR",
  language: "NL",
  timeZone: "Europe/Brussels"
}

export const permissionData = {
  "name": "UPDATE_PROFILE_IMAGE",
  "description": "update users profile image"
}

export const roleData = {
  "id": "5bfbfc3146e0fb321rsa4b28",
  "name": "string",
  "description": "string",
  "permissions": [
    {
      "name": "VIEW_PRESCRIPTIONS",
      "description": "string"
    }
  ],
  "creation_timestamp": 1497265621409,
  "update_timestamp": 1565954044301
}

interface Error {
  code: number;
  name: string;
  message: string;
}

export const ResourceUnknownException: Error = {
  code: 16,
  name: 'RESOURCE_UNKNOWN_EXCEPTION',
  message: 'Requested resource is unknown',
};

export const AuthenticationException: Error = {
  code: 106,
  name: 'AUTHENTICATION_EXCEPTION',
  message: 'This password email combination is unknown',
};

export const EmailUnknownException: Error = {
  code: 202,
  name: 'EMAIL_UNKNOWN_EXCEPTION',
  message: 'This email is not known',
};

export const EmailUsedException: Error = {
  code: 203,
  name: 'EMAIL_USED_EXCEPTION',
  message: 'This email address is already in use',
};

export const ResourceAlreadyExistsException: Error = {
  code: 203,
  name: 'RESOURCE_ALREADY_EXISTS_EXCEPTION',
  message: 'This resource already exists',
};

export const NotActivatedException: Error = {
  code: 204,
  name: 'NOT_ACTIVATED_EXCEPTION',
  message: 'This account needs to be activated before this action can be performed',
};

export const ActivationUnknownException: Error = {
  code: 205,
  name: 'ACTIVATION_UNKNOWN_EXCEPTION',
  message: 'This activation does not exist',
};

export const AlreadyActivatedException: Error = {
  code: 206,
  name: 'ALREADY_ACTIVATED_EXCEPTION',
  message: 'This user is already activated',
};

export const NewPasswordHashUnknownException: Error = {
  code: 207,
  name: 'NEW_PASSWORD_HASH_UNKNOWN_EXCEPTION',
  message: 'This new password hash does not exist',
};

export const PasswordException: Error = {
  code: 208,
  name: 'PASSWORD_EXCEPTION',
  message: 'The provided password is not correct',
};

export const LoginTimeoutException: Error = {
  code: 211,
  name: 'LOGIN_TIMEOUT_EXCEPTION',
  message: 'Login attempt too fast',
};

export const LoginFreezeException: Error = {
  code: 212,
  name: 'LOGIN_FREEZE_EXCEPTION',
  message: 'Login timeout in progress, too many failed login attempts',
};

export const TooManyFailedAttemptsException: Error = {
  code: 213,
  name: 'TOO_MANY_FAILED_ATTEMPTS_EXCEPTION',
  message: 'Account is locked due to too many failed login attempts',
};