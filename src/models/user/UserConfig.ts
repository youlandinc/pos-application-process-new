import { Instance, SnapshotOut, types } from 'mobx-state-tree';
import { LoginType, UserType } from '@/types';

export const UserConfig = types
  .model({
    userType: types.maybe(
      types.union(
        types.literal(UserType.CUSTOMER),
        types.literal(UserType.BROKER),
        types.literal(UserType.REAL_ESTATE_AGENT),
        types.literal(UserType.LOAN_OFFICER),
      ),
    ),
    loginType: types.maybe(
      types.union(
        types.literal(LoginType.YLACCOUNT_LOGIN),
        types.literal(LoginType.GOOGLE_LOGIN),
      ),
    ),
  })
  .actions((self) => ({
    updateUserType(value: UserType) {
      self.userType = value;
    },
    updateLoginType(value: LoginType) {
      self.loginType = value;
    },
  }));

export type IUserConfig = Instance<typeof UserConfig>;
export type SUserConfig = SnapshotOut<typeof UserConfig>;
