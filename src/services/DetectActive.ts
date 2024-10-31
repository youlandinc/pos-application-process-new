import { rootStore } from '@/models/Root';
import { User } from '@/types/user';
import { _userRefreshToken } from '@/requests/user';
import { LOGIN_APP_KEY, userpool } from '@/constants';
import { POSCreateDebounceFunction } from '@/utils';

// 1000 * seconds * minutes * hours
const EXPIRED_TIME = 1000 * 60 * 60 * 3;

// const EXPIRED_TIME = 3000;

export class DetectActiveService {
  private _userData: User.UserSignInRequest;
  private _refreshSessionTimerRef: NodeJS.Timer | undefined | any;
  private _isActive = false;
  private readonly _clearDebouncedUpdate: () => void;
  private readonly _debouncedUpdate: () => void;

  public destroy() {
    if (void 0 !== this._refreshSessionTimerRef) {
      clearInterval(this._refreshSessionTimerRef);
    }
    document.body.removeEventListener('click', this._debouncedUpdate);
    document.body.removeEventListener('mousemove', this._debouncedUpdate);
    document.body.removeEventListener('mousedown', this._debouncedUpdate);
    document.body.removeEventListener('keydown', this._debouncedUpdate);
    document.body.removeEventListener('scroll', this._debouncedUpdate);
    document.body.removeEventListener('touchmove', this._debouncedUpdate);
    this._clearDebouncedUpdate();
  }

  constructor(userData: User.UserSignInRequest) {
    this._userData = userData;
    this._isActive = true;

    const { run: debounceSetActive, cancel } = POSCreateDebounceFunction(() => {
      this._isActive = true;
    }, 300);
    this._debouncedUpdate = debounceSetActive;
    this._clearDebouncedUpdate = cancel;
  }

  public startDetect() {
    this._refreshSessionTimerRef = setInterval(() => {
      this._refreshSession.bind(this)();
    }, EXPIRED_TIME);
    this._detectUserOperation();
  }

  private async _refreshSession() {
    if (!this._isActive) {
      this._logout();
      return;
    }
    let session;
    const username = userpool.getLastAuthUserId();
    try {
      const {
        data: { refreshToken, accessToken },
      } = await _userRefreshToken({
        refreshToken: this._userData.refreshToken,
        appkey: LOGIN_APP_KEY,
      });
      this._userData.refreshToken = refreshToken;
      session = {
        refreshToken,
        accessToken,
      };
      userpool.setLastAuthUserToken('refreshToken', username, refreshToken);
      userpool.setLastAuthUserToken('idToken', username, accessToken);
      userpool.setLastAuthUserToken('accessToken', username, accessToken);
    } catch (err) {
      //eslint-disable-next-line no-console
      console.log(err);
      this._logout();
      return;
    }
    if (session) {
      DetectActiveService._updateSession(session);
    }
    this._isActive = false;
  }

  private static _updateSession(session: User.UserRefreshTokenRequest) {
    rootStore.injectCognitoUserSession(session);
  }

  private _logout() {
    this.destroy();
    rootStore.logout();
  }

  private _detectUserOperation() {
    document.body.addEventListener('click', this._debouncedUpdate);
    document.body.addEventListener('mousemove', this._debouncedUpdate);
    document.body.addEventListener('mousedown', this._debouncedUpdate);
    document.body.addEventListener('keydown', this._debouncedUpdate);
    document.body.addEventListener('scroll', this._debouncedUpdate);
    document.body.addEventListener('touchmove', this._debouncedUpdate);
  }
}
