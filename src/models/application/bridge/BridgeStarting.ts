import { BridgeStartingData } from '@/types/application/bridge';

import { StartingState, VariableName } from '@/types/enum';
import { Instance, SnapshotOut, types } from 'mobx-state-tree';

import { BridgeProperty } from './BridgeProperty';
import { BridgePurpose } from './BridgePurpose';
import { PropertyNumberOpt } from '@/types';

export const BridgeStarting = types
  .model({
    purpose: BridgePurpose,
    property: BridgeProperty,
    state: types.frozen<StartingState>(),
  })
  .actions((self) => ({
    changeState(state: typeof self.state) {
      self.state = state;
    },
    injectModifyData(data: any) {
      self.purpose.values.address.state = data.propAddr.state;
      self.property.values.propertyType =
        data.propertyType === '2_to_4_units'
          ? 'two_to_four_family'
          : data.propertyType;
    },
    injectServerData(value: BridgeStartingData) {
      const { propAddr, propertyType, propertyUnit, isConfirm } = value;
      self.purpose.values.propertyNumber = PropertyNumberOpt.zero;
      self.purpose.values.address.injectServerData(propAddr);

      self.property.values.propertyType = propertyType;
      self.property.values.propertyUnit = propertyUnit;
      self.property.values.isConfirm = isConfirm;
    },
    getPostData(): Variable<BridgeStartingData> {
      const {
        purpose: {
          values: {
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
          propertyNumber: PropertyNumberOpt.zero,
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

export type IBridgeStarting = Instance<typeof BridgeStarting>;
export type SBridgeStarting = SnapshotOut<typeof BridgeStarting>;
