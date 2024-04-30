import { enqueueSnackbar } from 'notistack';
import Router from 'next/router';

import { flow, Instance, SnapshotOut, types } from 'mobx-state-tree';
import {
  AddressData,
  BackgroundInformationFormData,
  CompensationInformationFromData,
  EstimateRateFormData,
  HttpError,
  LoanSnapshotEnum,
  StartingQuestionFormData,
} from '@/types';

import {
  ApplicationStartingQuestion,
  BackgroundInformation,
  CompensationInformation,
  EstimateRate,
} from '@/models/application';
import { Address } from '@/models/common/Address';

import { AUTO_HIDE_DURATION, FormData, URL_HASH } from '@/constants';

import { _fetchLoanDetailTest } from '@/requests/application';

export const ApplicationForm = types
  .model({
    initialized: types.boolean,
    loading: types.boolean,
    isBind: types.boolean,
    loanId: types.maybe(types.string),
    snapshot: types.union(
      types.literal(LoanSnapshotEnum.starting_question),
      types.literal(LoanSnapshotEnum.estimate_rate),
      types.literal(LoanSnapshotEnum.auth_page),
      types.literal(LoanSnapshotEnum.loan_address),
      types.literal(LoanSnapshotEnum.background_information),
      types.literal(LoanSnapshotEnum.compensation_page),
      types.literal(LoanSnapshotEnum.loan_summary),
      types.literal(LoanSnapshotEnum.loan_overview),
    ),
    startingQuestion: ApplicationStartingQuestion,
    estimateRate: EstimateRate,
    loanAddress: Address,
    backgroundInformation: BackgroundInformation,
    compensationInformation: CompensationInformation,
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
      self.snapshot = LoanSnapshotEnum.starting_question;
      self.startingQuestion.injectServerData(
        FormData[LoanSnapshotEnum.starting_question],
      );
      self.estimateRate.injectServerData(
        FormData[LoanSnapshotEnum.estimate_rate],
      );
      self.loanAddress.injectServerData({
        ...FormData[LoanSnapshotEnum.loan_address],
        address: FormData[LoanSnapshotEnum.loan_address].formatAddress,
      });
      self.backgroundInformation.injectServerData(
        FormData[LoanSnapshotEnum.background_information],
      );
      self.compensationInformation.injectServerData(
        FormData[LoanSnapshotEnum.compensation_page],
      );
    },
    injectServerData(
      snapshot: LoanSnapshotEnum,
      data:
        | StartingQuestionFormData
        | EstimateRateFormData
        | AddressData
        | BackgroundInformationFormData
        | CompensationInformationFromData,
    ) {
      switch (snapshot) {
        case LoanSnapshotEnum.starting_question:
          self.startingQuestion.injectServerData(
            data as StartingQuestionFormData,
          );
          break;
        case LoanSnapshotEnum.estimate_rate:
          self.estimateRate.injectServerData(data as EstimateRateFormData);
          break;
        case LoanSnapshotEnum.loan_address:
          self.loanAddress.injectServerData(data as AddressData);
          break;
        case LoanSnapshotEnum.background_information:
          self.backgroundInformation.injectServerData(
            data as BackgroundInformationFormData,
          );
          break;
        case LoanSnapshotEnum.compensation_page:
          self.compensationInformation.injectServerData(
            data as CompensationInformationFromData,
          );
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
          data: { snapshot, data, isBind },
        } = yield _fetchLoanDetailTest(loanId);
        self.snapshot = snapshot;
        self.loanId = loanId;
        self.isBind = isBind;
        self.injectServerData(snapshot, data);
        //eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        if (Router.pathname !== URL_HASH[snapshot]) {
          yield Router.push({
            //eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
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
