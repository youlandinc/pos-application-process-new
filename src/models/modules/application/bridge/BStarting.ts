import { Instance, SnapshotOut, types } from 'mobx-state-tree';
import { BPurpose } from '@/models/modules/application/bridge/BPurpose';
import { BProperty } from '@/models/modules/application/bridge/BProperty';
import { StartingState, VariableName } from '@/types/enum';
import { BridgeStartingData } from '@/types/variable';

export const BStarting = types
  .model({
    purpose: BPurpose,
    property: BProperty,
    state: types.frozen<StartingState>(),
  })
  .actions((self) => ({
    changeState(state: typeof self.state) {
      self.state = state;
    },
    injectServerData(value: BridgeStartingData) {
      const {
        propertyNumber,
        propAddr,
        propertyType,
        propertyUnit,
        isConfirm,
      } = value;
      self.purpose.values.propertyNumber = propertyNumber;
      self.purpose.values.address.injectServerData(propAddr);

      self.property.values.propertyType = propertyType;
      self.property.values.propertyUnit = propertyUnit;
      self.property.values.isConfirm = isConfirm;
    },
    getPostData(): Variable<BridgeStartingData> {
      const {
        purpose: {
          values: {
            propertyNumber,
            address: { formatAddress, state, aptNumber, city, postcode },
          },
        },
        property: {
          values: { propertyType, propertyUnit, isConfirm },
        },
      } = self;
      return {
        name: VariableName.starting,
        type: 'json',
        value: {
          propertyNumber,
          propertyType,
          propertyUnit,
          isConfirm,
          propAddr: {
            address: formatAddress,
            state,
            aptNumber,
            city,
            postcode,
          },
        },
      };
    },
  }));

export type IBStarting = Instance<typeof BStarting>;
export type SBStarting = SnapshotOut<typeof BStarting>;
