import { enqueueSnackbar } from 'notistack';
import Router from 'next/router';

import { flow, Instance, SnapshotOut, types } from 'mobx-state-tree';
import {
  AddressData,
  BackgroundInformationFormData,
  CompensationInformationFromData,
  EstimateRateFormData,
  HttpError,
  LandReadinessFormData,
  LoanAddressData,
  LoanProductCategoryEnum,
  LoanPropertyTypeEnum,
  LoanSnapshotEnum,
  SelectExecutiveFormData,
  StartingQuestionFormData,
  SubmitLeadFromData,
} from '@/types';

import {
  ApplicationStartingQuestion,
  BackgroundInformation,
  CompensationInformation,
  EstimateRate,
  LandReadiness,
  LoanAddress,
  SelectExecutive,
  SubmitLead,
} from '@/models/application';

import { AUTO_HIDE_DURATION, FormData, URL_HASH } from '@/constants';

import { _fetchLoanDetailTest } from '@/requests/application';

export const ApplicationForm = types
  .model({
    initialized: types.boolean,
    loading: types.boolean,
    isBind: types.boolean,
    loanId: types.maybe(types.string),
    productCategory: types.enumeration(Object.values(LoanProductCategoryEnum)),
    propertyType: types.enumeration(Object.values(LoanPropertyTypeEnum)),
    snapshot: types.enumeration(Object.values(LoanSnapshotEnum)),
    startingQuestion: ApplicationStartingQuestion,
    landReadiness: LandReadiness,
    estimateRate: EstimateRate,
    loanInformation: EstimateRate,
    loanAddress: LoanAddress,
    backgroundInformation: BackgroundInformation,
    selectExecutive: SelectExecutive,
    compensationInformation: CompensationInformation,
    submitLead: SubmitLead,
    // commercial
  })
  .actions((self) => ({
    setSnapshot(snapshot: LoanSnapshotEnum) {
      self.snapshot = snapshot;
    },
    setLoanId(loanId: string) {
      self.loanId = loanId;
    },
    setLoading(loading: boolean) {
      self.loading = loading;
    },
    setInitialized(initialized: boolean) {
      self.initialized = initialized;
    },
    setIsBind(isBind: boolean) {
      self.isBind = isBind;
    },
    resetForm() {
      self.loading = false;
      self.isBind = false;
      self.initialized = true;
      self.loanId = '';
      self.productCategory = LoanProductCategoryEnum.stabilized_bridge;
      self.propertyType = LoanPropertyTypeEnum.single_family;
      self.snapshot = LoanSnapshotEnum.starting_question;
      self.startingQuestion.injectServerData(
        FormData[LoanSnapshotEnum.starting_question],
      );
      self.estimateRate.injectServerData(
        FormData[LoanSnapshotEnum.estimate_rate],
      );
      self.loanInformation.injectServerData(
        FormData[LoanSnapshotEnum.estimate_rate],
      );
      const { additionalAddress, editable, ...rest } =
        FormData[LoanSnapshotEnum.loan_address];
      self.loanAddress.injectServerData({
        ...rest,
        address: rest.formatAddress,
      });
      self.loanAddress.injectAdditionalAddressServerData({
        additionalAddress,
        editable,
      });
      self.backgroundInformation.injectServerData(
        FormData[LoanSnapshotEnum.background_information],
      );
      self.selectExecutive.injectServerData(
        FormData[LoanSnapshotEnum.select_executive],
      );
      self.compensationInformation.injectServerData(
        FormData[LoanSnapshotEnum.compensation_page],
      );
    },
    injectServerData(
      snapshot: LoanSnapshotEnum,
      data:
        | StartingQuestionFormData
        | LandReadinessFormData
        | EstimateRateFormData
        | LoanAddressData
        | BackgroundInformationFormData
        | CompensationInformationFromData
        | SubmitLeadFromData
        | SelectExecutiveFormData,
    ) {
      switch (snapshot) {
        case LoanSnapshotEnum.starting_question:
          self.startingQuestion.injectServerData(
            data as StartingQuestionFormData,
          );
          break;
        case LoanSnapshotEnum.land_readiness:
          self.landReadiness.injectServerData(data as LandReadinessFormData);
          break;
        case LoanSnapshotEnum.estimate_rate:
          self.estimateRate.injectServerData(data as EstimateRateFormData);
          break;
        case LoanSnapshotEnum.enter_loan_info:
          self.loanInformation.injectServerData(data as EstimateRateFormData);
          break;
        case LoanSnapshotEnum.loan_address: {
          const { additionalAddress, editable, ...rest } =
            data as LoanAddressData;
          self.loanAddress.injectServerData(rest as AddressData);
          self.loanAddress.injectAdditionalAddressServerData({
            editable,
            additionalAddress: additionalAddress as AddressData[],
          });
          break;
        }
        case LoanSnapshotEnum.background_information:
          self.backgroundInformation.injectServerData(
            data as BackgroundInformationFormData,
          );
          break;
        case LoanSnapshotEnum.select_executive:
          self.selectExecutive.injectServerData(
            data as SelectExecutiveFormData,
          );
          break;
        case LoanSnapshotEnum.compensation_page:
          self.compensationInformation.injectServerData(
            data as CompensationInformationFromData,
          );
          break;
        case LoanSnapshotEnum.contact_info:
          self.submitLead.injectServerData(data as SubmitLeadFromData);
          break;
        default:
          break;
      }
    },
  }))
  .actions((self) => {
    const fetchApplicationFormData = flow(function* (loanId: string) {
      self.initialized = false;
      self.loading = true;
      try {
        const {
          data: { snapshot, data, isBind, productCategory, propertyType },
        } = yield _fetchLoanDetailTest(loanId);
        self.snapshot = snapshot;
        self.loanId = loanId;
        self.isBind = isBind;
        self.productCategory = productCategory;
        self.propertyType = propertyType;
        self.injectServerData(snapshot, data);

        if (Router.pathname !== URL_HASH[snapshot]) {
          yield Router.push({
            pathname: URL_HASH[snapshot],
            query: { loanId },
          });
        }
        self.loading = false;
        self.initialized = true;
        return data;
      } catch (err) {
        self.loading = false;
        const { header, message, variant } = err as HttpError;
        enqueueSnackbar(message, {
          variant: variant || 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
          isSimple: !header,
          header,
          onClose: () => (window.location.href = '/'),
        });
      }
    });
    return {
      fetchApplicationFormData,
    };
  });

export type IApplicationForm = Instance<typeof ApplicationForm>;
export type SApplicationForm = SnapshotOut<typeof ApplicationForm>;
