import { flow, Instance, SnapshotOut, types } from 'mobx-state-tree';
import { User } from '@/types/user';
import { AxiosResponse } from 'axios';
import { _fetchUserSetting, _updateUserSetting } from '@/requests';

export const UserSetting = types
  .model({
    setting: types.frozen<User.UserSetting>(),
    loading: types.boolean,
    initialized: types.boolean,
  })
  .actions((self) => ({
    setUserSetting(setting: User.UserSetting) {
      self.setting = setting;
    },
    changeSettingField: flow(function* <
      K extends keyof (typeof self)['setting'],
    >(key: K, value: (typeof self.setting)[K]) {
      self.setting = {
        ...self.setting,
        [key]: value,
      };
      yield _updateUserSetting({ [key]: value });
    }),
  }))
  .actions((self) => {
    const fetchUserSetting = flow(function* () {
      self.loading = true;
      try {
        const res: AxiosResponse<User.UserSetting> = yield _fetchUserSetting();
        self.setUserSetting(res.data);
        self.initialized = true;
        self.loading = false;
      } catch (e) {
        self.loading = false;
        self.initialized = false;
        console.log(e);
      }
    });
    return {
      fetchUserSetting,
    };
  });

export type IUserSetting = Instance<typeof UserSetting>;
export type SUserSetting = SnapshotOut<typeof UserSetting>;
