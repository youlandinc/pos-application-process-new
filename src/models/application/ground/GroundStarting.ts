import { GroundStartingData, PropertyNumberOpt } from '@/types';

import { StartingState, VariableName } from '@/types/enum';
import { Instance, SnapshotOut, types } from 'mobx-state-tree';

import { GroundProperty } from './GroundProperty';
import { GroundPurpose } from './GroundPurpose';

export const GroundStarting = types
  .model({
    purpose: GroundPurpose,
    property: GroundProperty,
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
    injectServerData(value: GroundStartingData) {
      const { propAddr, propertyType, propertyUnit, isConfirm } = value;
      self.purpose.values.propertyNumber = PropertyNumberOpt.zero;
      self.purpose.values.address.injectServerData(propAddr);

      self.property.values.propertyType = propertyType;
      self.property.values.propertyUnit = propertyUnit;
      self.property.values.isConfirm = isConfirm;
    },
    getPostData(): Variable<GroundStartingData> {
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

export type IGroundStarting = Instance<typeof GroundStarting>;
export type SGroundStarting = SnapshotOut<typeof GroundStarting>;
