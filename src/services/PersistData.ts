import { RootModel, rootStore } from '@/models/Root';
import { User } from '@/types/user';
import { IReactionPublic, reaction } from 'mobx';

export type RootStoreKey = keyof typeof RootModel;

const SESSION_KEY = 'SESSION_KEY';
const PROFILE_KEY = 'PROFILE_KEY';
const USER_SETTING_KEY = 'USER_SETTING_KEY';

type StorageKey = 'SESSION_KEY' | 'PROFILE_KEY' | 'USER_SETTING_KEY';

export class AutoPersistService {
  services: BasePersistService[];

  constructor(rootStoreKeys: RootStoreKey[]) {
    this.services = rootStoreKeys
      .map((key) => createPersistService(key))
      .filter((service) => service !== void 0) as BasePersistService[];
  }

  public loadPersisDataFromStorage() {
    this.services.forEach((service) => {
      service.loadDataFromStorage();
    });
  }

  public autoStoreWhenStateChange() {
    this.services.forEach((service) => {
      service.autoStoreWhenStateChange();
    });
  }

  public destroy() {
    this.services.forEach((service) => {
      service.destroy();
    });
  }
}

class BasePersistService {
  rootStoreKey: RootStoreKey;
  storageKey: StorageKey;
  reaction: IReactionPublic;

  loadDataFromStorage() {
    throw new Error('not implemented');
  }

  autoStoreWhenStateChange() {
    reaction(
      () => rootStore[this.rootStoreKey],
      (value, _, reaction) => {
        this.reaction = reaction;
        if (value) {
          localStorage.setItem(this.storageKey, JSON.stringify(value));
        } else {
          localStorage.removeItem(this.storageKey);
        }
      },
    );
  }

  destroy() {
    if (!this.reaction) {
      return;
    }
    this.reaction.dispose();
  }
}

class PersistSessionService extends BasePersistService {
  rootStoreKey: RootStoreKey;
  storageKey: StorageKey;

  constructor() {
    super();
    this.rootStoreKey = 'session';
    this.storageKey = SESSION_KEY;
  }

  loadDataFromStorage() {
    const data = localStorage.getItem(this.storageKey);
    if (!data) {
      return;
    }
    const json = <UserSession>JSON.parse(data);
    rootStore.updateSession(json);
  }
}

class PersistProfileService extends BasePersistService {
  rootStoreKey: RootStoreKey;
  storageKey: StorageKey;

  constructor() {
    super();
    this.rootStoreKey = 'userProfile';
    this.storageKey = PROFILE_KEY;
  }

  loadDataFromStorage() {
    const data = localStorage.getItem(this.storageKey);
    if (!data) {
      return;
    }
    const json = <ClientUserProfile>JSON.parse(data);
    rootStore.updateProfile(json);
  }
}

class PersistUserSettingService extends BasePersistService {
  rootStoreKey: RootStoreKey;
  storageKey: StorageKey;

  constructor() {
    super();
    this.rootStoreKey = 'userSetting';
    this.storageKey = USER_SETTING_KEY;
  }

  loadDataFromStorage() {
    const data = localStorage.getItem(this.storageKey);
    if (!data) {
      return;
    }
    const json = <User.UserSetting>JSON.parse(data);
    rootStore.userSetting.setUserSetting(json);
  }
}

function createPersistService(
  rootStoreKey: RootStoreKey,
): BasePersistService | void {
  switch (rootStoreKey) {
    case 'session':
      return new PersistSessionService();
    case 'userProfile':
      return new PersistProfileService();
    case 'userSetting':
      return new PersistUserSettingService();
    default:
      return;
  }
}
