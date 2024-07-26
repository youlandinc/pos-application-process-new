export interface AccountUserChangePasswordParams {
  newPass: string;
  oldPass: string;
}

export interface AccountUserProfileParams {
  avatar: string;
  firstName: string;
  lastName: string;
  birthDay: string | null | Date;
  email: string;
  phone: string;
  companyName: string;
}
