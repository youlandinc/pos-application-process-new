import Router from 'next/router';
import { enqueueSnackbar } from 'notistack';
import { flow, Instance, SnapshotOut, types } from 'mobx-state-tree';

import { AUTO_HIDE_DURATION } from '@/constants';
import { Address } from '@/models/common/Address';

import { HttpError, LoanPropertyTypeEnum, LoanPropertyUnitEnum } from '@/types';
import { _fetchDashboardInfo, _fetchLoanTaskList } from '@/requests/dashboard';

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
    loanNumber: types.maybe(types.string),
    taskMap: types.map(types.boolean),
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
          data: {
            propertyAddress,
            loanType,
            propertyType,
            propertyUnit,
            loanNumber,
          },
        } = yield _fetchDashboardInfo(loanId);
        self.propertyAddress.injectServerData(propertyAddress);
        self.loanType = loanType;
        self.propertyType = propertyType || LoanPropertyTypeEnum.default;
        self.propertyUnit = propertyUnit || LoanPropertyUnitEnum.default;
        self.loanId = loanId;
        self.loanNumber = loanNumber ?? '';
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
    const fetchTaskMap = flow(function* (loanId: string) {
      if (!loanId) {
        yield Router.push('/pipeline');
        enqueueSnackbar('Invalid loan ID', {
          variant: 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
        });
        return;
      }
      try {
        const { data } = yield _fetchLoanTaskList(loanId);
        self.taskMap = data;
      } catch (err) {
        const { header, message, variant } = err as HttpError;
        enqueueSnackbar(message, {
          variant: variant || 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
          isSimple: !header,
          header,
        });
      }
    });
    return {
      fetchDashboardInfo,
      fetchTaskMap,
    };
  });

export type IDashboardInfo = Instance<typeof DashboardInfo>;
export type SDashboardInfo = SnapshotOut<typeof DashboardInfo>;
