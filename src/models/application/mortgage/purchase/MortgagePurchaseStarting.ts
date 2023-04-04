import { Instance, SnapshotOut, types } from 'mobx-state-tree';
import { MortgagePurchaseProperty, MortgagePurchasePurpose } from './index';
import { Options } from '@/types/options';
import { MortgageStartingData } from '@/types/application';
import { StartingState, VariableName } from '@/types/enum';

export const MortgagePurchaseStarting = types
  .model({
    purpose: MortgagePurchasePurpose,
    property: MortgagePurchaseProperty,
    state: types.frozen<StartingState>(),
  })
  .views((self) => ({
    get propertyIsValid() {
      if (
        self.property.values.propertyOpt === Options.PropertyOpt.twoToFourFamily
      ) {
        return !!(
          self.property.values.rentalIncome &&
          self.property.values.numberOfUnits
        );
      }
      return !!(
        self.property.values.occupancyOpt && self.property.values.propertyOpt
      );
    },
  }))
  .actions((self) => ({
    changeState(state: typeof self.state) {
      self.state = state;
    },
    injectServerData(value: MortgageStartingData) {
      const {
        stageOpt,
        offerOpt,
        purchaseTimeOpt,
        propAddr,
        numberOfUnits,
        occupancyOpt,
        rentalIncome,
        propertyOpt,
      } = value;
      self.purpose.values.stageOpt = stageOpt;
      self.purpose.values.offerOpt = offerOpt;
      self.purpose.values.purchaseTimeOpt = purchaseTimeOpt;
      self.purpose.values.address.injectServerData(propAddr);

      // property
      self.property.values.occupancyOpt = occupancyOpt;
      self.property.values.propertyOpt = propertyOpt;
      self.property.values.numberOfUnits = numberOfUnits;
      self.property.values.rentalIncome = rentalIncome;
      self.property.isValid = self.propertyIsValid;
    },
    getPostData(): Variable<MortgageStartingData> {
      const {
        values: {
          stageOpt,
          offerOpt,
          purchaseTimeOpt,
          address: { formatAddress, state, aptNumber, city, postcode },
        },
      } = self.purpose;
      const {
        values: {
          occupancyOpt,
          //constructionOpt,
          numberOfUnits,
          propertyOpt,
          rentalIncome,
        },
      } = self.property;
      return {
        name: VariableName.starting,
        type: 'json',
        value: {
          stageOpt,
          offerOpt,
          purchaseTimeOpt,
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
        },
      };
    },
  }));

export type IMortgagePurchaseStarting = Instance<
  typeof MortgagePurchaseStarting
>;
export type SMortgagePurchaseStarting = SnapshotOut<
  typeof MortgagePurchaseStarting
>;
