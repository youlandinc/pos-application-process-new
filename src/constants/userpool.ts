import CryptoJS from 'crypto-js';
import { User } from '@/types/user';
import { LoginType, UserType } from '@/types/enum';
import { _userRefreshToken } from '@/requests';
import { LOGIN_APP_KEY } from '@/constants/default';
import { rootStore } from '@/models/Root';

type LOGIN_STORAGE = 'idToken' | 'accessToken' | 'refreshToken' | 'clockDrift';
type LOGIN_PROFILE =
  | 'email'
  | 'name'
  | 'user_type'
  | 'login_type'
  | 'avatar'
  | 'firstName'
  | 'lastName'
  | 'background';

export const userpool = {
  encode: (password: string): string => {
    const encodeWord = CryptoJS.enc.Utf8.parse(password);
    return CryptoJS.enc.Base64.stringify(encodeWord);
  },
  decode: (password: string): string => {
    const encodedWord = CryptoJS.enc.Base64.parse(password);
    return CryptoJS.enc.Utf8.stringify(encodedWord);
  },
  setLastAuthUserBase(info: User.UserSignInRequest): void {
    const {
      userProfile: {
        userId,
        email,
        userType,
        loginType,
        avatar,
        firstName,
        lastName,
        backgroundColor,
      },
      refreshToken,
      accessToken,
      expiredIn,
    } = info;
    const prefix = `${this._getKeyPrefix()}.${userId}`;
    const lastAuthId = this.getLastAuthUserId();
    if (!localStorage) {
      return;
    }
    if (userId !== lastAuthId) {
      this.clearLastAuthUserToken(lastAuthId);
      this.clearLastAuthUserInfo(lastAuthId);
    }
    localStorage.setItem(`${prefix}.idToken`, accessToken);
    localStorage.setItem(`${prefix}.accessToken`, accessToken);
    localStorage.setItem(`${prefix}.refreshToken`, refreshToken);
    localStorage.setItem(`${prefix}.clockDrift`, expiredIn + '');
    localStorage.setItem(`${prefix}.lastAuthUser_email`, email as string);
    localStorage.setItem(
      `${prefix}.lastAuthUser_user_type`,
      userType as string,
    );
    localStorage.setItem(
      `${prefix}.lastAuthUser_login_type`,
      loginType as string,
    );
    localStorage.setItem(
      `${this._getKeyPrefix()}.lastAuthUser_id`,
      userId as string,
    );
    localStorage.setItem(
      `${prefix}.lastAuthUser_avatar`,
      (avatar ?? '') as string,
    );
    localStorage.setItem(
      `${prefix}.lastAuthUser_firstName`,
      (firstName ?? '') as string,
    );
    localStorage.setItem(
      `${prefix}.lastAuthUser_lastName`,
      (lastName ?? '') as string,
    );
    localStorage.setItem(
      `${prefix}.lastAuthUser_background`,
      (backgroundColor ?? '') as string,
    );
  },
  setLastAuthUserToken(
    key: LOGIN_STORAGE,
    userId: string,
    token: string,
  ): void {
    const prefix = `${this._getKeyPrefix()}.${userId}`;
    localStorage.setItem(`${prefix}.${key}`, token);
  },
  getLastAuthUserToken(userId: string, key: LOGIN_STORAGE): string {
    const _key = `${this._getKeyPrefix()}.${userId}.${key}`;
    return localStorage.getItem(_key) || '';
  },
  clearLastAuthUserToken(userId: string): void {
    const prefix = `${this._getKeyPrefix()}.${userId}`;
    localStorage.removeItem(`${prefix}.idToken`);
    localStorage.removeItem(`${prefix}.accessToken`);
    localStorage.removeItem(`${prefix}.refreshToken`);
    localStorage.removeItem(`${prefix}.clockDrift`);
  },
  setLastAuthUserInfo(
    userId: string,
    key: LOGIN_PROFILE,
    info: string | UserType,
  ): void {
    const prefix = `${this._getKeyPrefix()}.${userId}`;
    localStorage.setItem(`${prefix}.lastAuthUser_${key}`, info);
  },
  getLastAuthUserInfo(
    userId: string,
    key: LOGIN_PROFILE,
  ): string | UserType | LoginType {
    const _key = `${this._getKeyPrefix()}.${userId}.lastAuthUser_${key}`;
    // if in server env
    return localStorage.getItem(_key) || '';
  },
  clearLastAuthUserInfo(userId: string): void {
    const prefix = `${this._getKeyPrefix()}.${userId}`;
    localStorage.removeItem(`${prefix}.lastAuthUser_email`);
    localStorage.removeItem(`${prefix}.lastAuthUser_user_type`);
    localStorage.removeItem(`${prefix}.lastAuthUser_login_type`);
    localStorage.removeItem(`${prefix}.lastAuthUser_avatar`);
    this.clearLastAuthUserId();
  },
  getLastAuthUserId(): string {
    const _key = `${this._getKeyPrefix()}.lastAuthUser_id`;
    // if in server env
    return localStorage.getItem(_key) || '';
  },
  clearLastAuthUserId(): void {
    localStorage.removeItem(`${this._getKeyPrefix()}.lastAuthUser_id`);
  },
  _getKeyPrefix(): string {
    return this.encode('USER_POOL_IDENTITY_SERVICE_PROVIDE');
  },
  async refreshToken(userId: string) {
    const prefix = `${this._getKeyPrefix()}.${userId}`;
    if (!localStorage.getItem(`${prefix}.refreshToken`)) {
      return;
    }
    const {
      data: { refreshToken, accessToken, expiredIn },
    } = await _userRefreshToken({
      refreshToken: localStorage.getItem(`${prefix}.refreshToken`)!,
      appkey: LOGIN_APP_KEY,
    });

    localStorage.setItem(`${prefix}.refreshToken`, refreshToken);
    localStorage.setItem(`${prefix}.idToken`, accessToken);
    localStorage.setItem(`${prefix}.accessToken`, accessToken);

    rootStore.injectCognitoUserSession({
      refreshToken,
      accessToken,
      expiredIn,
    });
  },
};
