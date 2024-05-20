import { flow, Instance, SnapshotOut, types } from 'mobx-state-tree';
import { Address } from '@/models/common/Address';
import { HttpError, LoanPropertyTypeEnum, LoanPropertyUnitEnum } from '@/types';
import { AUTO_HIDE_DURATION } from '@/constants';
import { enqueueSnackbar } from 'notistack';
import { _fetchDashboardInfo } from '@/requests/dashboard';

export const DashboardInfo = types
  .model({
    propertyAddress: Address,
    propertyType: types.union(
      types.literal(LoanPropertyTypeEnum.default),
      types.literal(LoanPropertyTypeEnum.single_family),
      types.literal(LoanPropertyTypeEnum.townhouse),
      types.literal(LoanPropertyTypeEnum.condo),
      types.literal(LoanPropertyTypeEnum.two_to_four_family),
    ),
    propertyUnit: types.union(
      types.literal(LoanPropertyUnitEnum.default),
      types.literal(LoanPropertyUnitEnum.two_units),
      types.literal(LoanPropertyUnitEnum.three_units),
      types.literal(LoanPropertyUnitEnum.four_units),
    ),
    loanType: types.maybe(types.string),
    loading: types.boolean,
    loanId: types.maybe(types.string),
  })
  .actions((self) => ({
    setLoanId(loanId: string) {
      self.loanId = loanId;
    },
    setLoading(loading: boolean) {
      self.loading = loading;
    },
  }))
  .actions((self) => {
    const fetchDashboardInfo = flow(function* (loanId: string) {
      if (loanId === self.loanId || !loanId) {
        return;
      }
      self.loading = true;
      try {
        const {
          data: { propertyAddress, loanType, propertyType, propertyUnit },
        } = yield _fetchDashboardInfo(loanId);
        self.propertyAddress.injectServerData(propertyAddress);
        self.loanType = loanType;
        self.propertyType = propertyType || LoanPropertyTypeEnum.default;
        self.propertyUnit = propertyUnit || LoanPropertyUnitEnum.default;
        self.loanId = loanId;
      } catch (err) {
        const { header, message, variant } = err as HttpError;
        enqueueSnackbar(message, {
          variant: variant || 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
          isSimple: !header,
          header,
          onClose: () => (window.location.href = '/pipeline'),
        });
      } finally {
        self.loading = false;
      }
    });
    return {
      fetchDashboardInfo,
    };
  });

export type IDashboardInfo = Instance<typeof DashboardInfo>;
export type SDashboardInfo = SnapshotOut<typeof DashboardInfo>;
