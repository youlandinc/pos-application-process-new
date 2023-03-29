import validate from '@/common/validate';
import { EstateAgent } from '@/types/variable';
import { RealtorSchema } from '@/common/schema';
import { destroy, Instance, SnapshotOut, types } from 'mobx-state-tree';
import { VariableName } from '@/types/enum';

export const MortgagePurchaseRealtor = types
  .model({
    firstName: types.string,
    lastName: types.string,
    email: types.string,
    phoneNumber: types.string,
    errors: types.optional(
      types.model({
        firstName: types.maybe(types.array(types.string)),
        lastName: types.maybe(types.array(types.string)),
        phoneNumber: types.maybe(types.array(types.string)),
        email: types.maybe(types.array(types.string)),
      }),
      {},
    ),
    isSkip: types.boolean,
    isValid: types.boolean,
  })
  .views((self) => {
    return {
      get checkIsValid() {
        return (
          !!self.firstName &&
          !!self.lastName &&
          !!self.email &&
          !!self.phoneNumber &&
          !!self.isValid
        );
      },
    };
  })
  .actions((self) => {
    return {
      changeFieldValue<K extends keyof typeof self>(
        key: K,
        value: (typeof self)[K],
      ) {
        const errors = validate(
          { [key]: value },
          { [key]: RealtorSchema[key] },
        );
        self.errors = { ...self.errors, ...(errors || {}) };
        if (self.errors[key as unknown as any] && errors === void 0) {
          destroy(self.errors[key as unknown as any]);
        }
        self.isValid = Object.values(self.errors).every((item) => !item);
        self[key] = value;

        if (key === 'firstName' || key === 'lastName') {
          self[key] = (value as string).replace(/^./, (match) =>
            match.toUpperCase(),
          ) as typeof value;
        }
      },
      getPostData(): Variable<EstateAgent> {
        const { firstName, lastName, email, phoneNumber } = self;
        return {
          name: VariableName.estateAgent,
          type: 'json',
          value: {
            firstName,
            lastName,
            email,
            phoneNumber,
          },
        };
      },
    };
  });

export type IMPRealtor = Instance<typeof MortgagePurchaseRealtor>;
export type SMPRealtor = SnapshotOut<typeof MortgagePurchaseRealtor>;
