// import { flow, Instance, SnapshotOut, types } from 'mobx-state-tree';
// import { _fetchPipelineStatus } from '@/requests';
// import { PipelineAccountStatus } from '@/types';
// import { userpool } from '@/constants';
// //import { AUTO_HIDE_DURATION } from '@/constants';
// //import { enqueueSnackbar } from 'notistack';
//
// export const UserSetting = types
//   .model({
//     loading: types.boolean,
//     pipelineStatus: types.maybe(
//       types.union(
//         types.literal(PipelineAccountStatus.active),
//         types.literal(PipelineAccountStatus.suspended),
//         types.literal(PipelineAccountStatus.pending_info),
//         types.literal(PipelineAccountStatus.ready_for_review),
//       ),
//     ),
//     pipelineStatusInitialized: types.boolean,
//     pipelineAdditionDetails: types.maybe(types.string),
//     applicable: types.boolean,
//   })
//   .actions((self) => {
//     const fetchPipelineStatus = flow(function* () {
//       self.loading = true;
//       try {
//         const res = yield _fetchPipelineStatus();
//         const { status, additionDetails, applicable, userProfile } = res.data;
//         self.pipelineStatus = status;
//         self.pipelineAdditionDetails = additionDetails ?? '';
//         self.applicable = applicable;
//         self.loading = false;
//         self.pipelineStatusInitialized = true;
//         if (userProfile) {
//           const { userId, account, avatar, loginType, userType } = userProfile;
//           userpool.setLastAuthUserInfo(userId, 'avatar', avatar);
//           userpool.setLastAuthUserInfo(userId, 'login_type', loginType);
//           userpool.setLastAuthUserInfo(userId, 'user_type', userType);
//           userpool.setLastAuthUserInfo(userId, 'email', account);
//         }
//       } catch (err) {
//         self.loading = false;
//         self.pipelineStatusInitialized = false;
//         //eslint-disable-next-line no-console
//         console.log(err);
//         //enqueueSnackbar(e as string, {
//         //  variant: 'error',
//         //  autoHideDuration: AUTO_HIDE_DURATION,
//         //});
//       }
//     });
//     return {
//       fetchPipelineStatus,
//     };
//   });
//
// export type IUserSetting = Instance<typeof UserSetting>;
// export type SUserSetting = SnapshotOut<typeof UserSetting>;
