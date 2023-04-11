import { Instance, SnapshotOut, types } from 'mobx-state-tree';

import { MortgageRefinanceProperty } from '@/models/application/mortgage/refinance/MortgageRefinanceProperty';
import { MortgageRefinancePurpose } from '@/models/application/mortgage/refinance/MortgageRefinancePurpose';

import { PropertyOpt } from '@/types/options';
import { MRStartingData } from '@/types/application';
import { StartingState, VariableName } from '@/types/enum';

export const MortgageRefinanceStarting = types
  .model({
    purpose: MortgageRefinancePurpose,
    property: MortgageRefinanceProperty,
    state: types.frozen<StartingState>(),
  })
  .views((self) => ({
    get propertyIsValid() {
      if (self.property.values.propertyOpt === PropertyOpt.twoToFourFamily) {
        return !!(
          self.property.values.rentalIncome &&
          self.property.values.numberOfUnits &&
          self.property.values.homeValue
        );
      }
      return !!(
        self.property.values.occupancyOpt &&
        self.property.values.propertyOpt &&
        self.property.values.homeValue
      );
    },
  }))
  .actions((self) => ({
    changeState(state: typeof self.state) {
      self.state = state;
    },
    injectServerData(value: MRStartingData) {
      const {
        propAddr,
        numberOfUnits,
        occupancyOpt,
        rentalIncome,
        propertyOpt,
        homeValue,
      } = value;
      self.purpose.values.address.injectServerData(propAddr);

      // property
      self.property.values.occupancyOpt = occupancyOpt;
      self.property.values.propertyOpt = propertyOpt;
      self.property.values.numberOfUnits = numberOfUnits;
      self.property.values.rentalIncome = rentalIncome;
      self.property.values.homeValue = homeValue;
      self.property.isValid = self.propertyIsValid;
    },
    getPostData(): Variable<MRStartingData> {
      const {
        values: {
          address: { formatAddress, state, aptNumber, city, postcode },
        },
      } = self.purpose;
      const {
        values: {
          occupancyOpt,
          numberOfUnits,
          propertyOpt,
          rentalIncome,
          homeValue,
        },
      } = self.property;
      return {
        name: VariableName.starting,
        type: 'json',
        value: {
          propAddr: {
            address: formatAddress,
            aptNumber,
            city,
            state,
            postcode,
          },
          occupancyOpt,
          propertyOpt,
          numberOfUnits,
          rentalIncome,
          homeValue,
        },
      };
    },
  }));

export type IMortgageRefinanceStarting = Instance<
  typeof MortgageRefinanceStarting
>;
export type SMortgageRefinanceStarting = SnapshotOut<
  typeof MortgageRefinanceStarting
>;
