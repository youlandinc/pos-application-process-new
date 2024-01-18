import { flow, Instance, SnapshotOut, types } from 'mobx-state-tree';
import { _fetchPipelineStatus } from '@/requests';
import { PipelineAccountStatus } from '@/types';
//import { AUTO_HIDE_DURATION } from '@/constants';
//import { enqueueSnackbar } from 'notistack';

export const UserSetting = types
  .model({
    loading: types.boolean,
    pipelineStatus: types.maybe(
      types.union(
        types.literal(PipelineAccountStatus.active),
        types.literal(PipelineAccountStatus.suspended),
        types.literal(PipelineAccountStatus.pending_info),
        types.literal(PipelineAccountStatus.ready_for_review),
      ),
    ),
    pipelineStatusInitialized: types.boolean,
    pipelineAdditionDetails: types.maybe(types.string),
  })
  .actions((self) => {
    const fetchPipelineStatus = flow(function* () {
      self.loading = true;
      try {
        const res = yield _fetchPipelineStatus();
        const { status, additionDetails } = res.data;
        self.pipelineStatus = status;
        self.pipelineAdditionDetails = additionDetails ?? '';
        self.loading = false;
        self.pipelineStatusInitialized = true;
      } catch (err) {
        self.loading = false;
        self.pipelineStatusInitialized = false;
        //eslint-disable-next-line no-console
        console.log(err);
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
