export interface AccountUserInfo {
  avatar: string;
  phone: string;
  birthday: Date | string | null;
  email: string;
  firstName: string;
  lastName: string;
}

export interface AccountUserChangePasswordParams {
  newPass: string;
  oldPass: string;
}
