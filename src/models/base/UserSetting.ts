import { flow, Instance, SnapshotOut, types } from 'mobx-state-tree';
import { User } from '@/types/user';
import { AxiosResponse } from 'axios';
import {
  _fetchPipelineStatus,
  _fetchUserSetting,
  _updateUserSetting,
} from '@/requests';
import { AUTO_HIDE_DURATION } from '@/constants';
import { enqueueSnackbar } from 'notistack';

export const UserSetting = types
  .model({
    setting: types.frozen<User.UserSetting>(),
    loading: types.boolean,
    initialized: types.boolean,
    pipelineStatus: types.boolean,
    pipelineStatusInitialized: types.boolean,
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
        enqueueSnackbar(e as string, {
          variant: 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
        });
      }
    });
    const fetchPipelineStatus = flow(function* () {
      self.loading = true;
      try {
        const res = yield _fetchPipelineStatus();
        self.pipelineStatus = res.data;
        self.loading = false;
        self.pipelineStatusInitialized = true;
      } catch (e) {
        self.loading = false;
        self.pipelineStatusInitialized = false;
        enqueueSnackbar(e as string, {
          variant: 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
        });
      }
    });
    return {
      fetchUserSetting,
      fetchPipelineStatus,
    };
  });

export type IUserSetting = Instance<typeof UserSetting>;
export type SUserSetting = SnapshotOut<typeof UserSetting>;
