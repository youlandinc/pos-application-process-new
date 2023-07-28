import { Instance, SnapshotOut, types } from 'mobx-state-tree';

import { GroundProperty } from './GroundProperty';
import { GroundPurpose } from './GroundPurpose';

import { StartingState, VariableName } from '@/types/enum';
import { GroundStartingData } from '@/types';

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
    injectServerData(value: GroundStartingData) {
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
    getPostData(): Variable<GroundStartingData> {
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

export type IGroundStarting = Instance<typeof GroundStarting>;
export type SGroundStarting = SnapshotOut<typeof GroundStarting>;
