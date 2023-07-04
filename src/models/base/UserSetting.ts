import { flow, Instance, SnapshotOut, types } from 'mobx-state-tree';
import { _fetchPipelineStatus } from '@/requests';
//import { AUTO_HIDE_DURATION } from '@/constants';
//import { enqueueSnackbar } from 'notistack';

export const UserSetting = types
  .model({
    loading: types.boolean,
    pipelineStatus: types.maybe(types.boolean),
    pipelineStatusInitialized: types.boolean,
  })
  .actions((self) => {
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
        //eslint-disable-next-line no-console
        console.log(e);
        //enqueueSnackbar(e as string, {
        //  variant: 'error',
        //  autoHideDuration: AUTO_HIDE_DURATION,
        //});
      }
    });
    return {
      fetchPipelineStatus,
    };
  });

export type IUserSetting = Instance<typeof UserSetting>;
export type SUserSetting = SnapshotOut<typeof UserSetting>;
