import { POSFindSpecificVariable } from '@/utils';
import { flow, Instance, types } from 'mobx-state-tree';
import { AxiosResponse } from 'axios';
import { enqueueSnackbar } from 'notistack';

import { LoanStage, ProcessData, SceneType, VariableName } from '@/types';
import { _fetchProcessData } from '@/requests';
import { AUTO_HIDE_DURATION } from '@/constants';

export const SelectedProcessData = types
  .model({
    data: types.maybe(types.frozen<ProcessData>()),
    loading: types.boolean,
    scene: types.union(
      types.literal(SceneType.default),
      types.literal(SceneType.unknown),
      types.literal(SceneType.mortgage_purchase),
      types.literal(SceneType.mortgage_refinance),
      types.literal(SceneType.bridge_purchase),
      types.literal(SceneType.bridge_refinance),
      types.literal(SceneType.fix_purchase),
      types.literal(SceneType.fix_refinance),
      types.literal(SceneType.ground_purchase),
      types.literal(SceneType.ground_refinance),
    ),
    loanStage: types.union(
      types.literal(LoanStage.Application),
      types.literal(LoanStage.PreApproved),
      types.literal(LoanStage.RateLocking),
      types.literal(LoanStage.RateLocked),
      types.literal(LoanStage.Approved),
      types.literal(LoanStage.FinalClosing),
      types.literal(LoanStage.Refusal),
    ),
  })
  .actions((self) => ({
    setProcessData(processData: ProcessData) {
      self.data = processData;
    },
    setScene(scene: SceneType) {
      self.scene = scene;
    },
    setLoanStage(loanStage: LoanStage) {
      self.loanStage = loanStage;
    },
    setLoading(loading: boolean) {
      self.loading = loading;
    },
  }))
  .actions((self) => {
    const fetchProcessData = flow(function* (processId) {
      self.loading = true;
      try {
        const res: AxiosResponse<ProcessData> = yield _fetchProcessData(
          processId,
        );

        self.loading = false;
        self.setProcessData(res.data);
        const clientAppProgressData = POSFindSpecificVariable(
          VariableName.clientAppProgress,
          res.data.extra.variables,
        );
        if (!clientAppProgressData) {
          return;
        }
        const {
          value: { productCategory, applicationType },
        } = clientAppProgressData;
        self.setScene(`${productCategory} ${applicationType}` as SceneType);
        self.setLoanStage(res.data.stage as string as LoanStage);
      } catch (e) {
        enqueueSnackbar(e as string, {
          variant: 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
        });
      } finally {
        self.loading = false;
      }
    });
    return {
      fetchProcessData,
    };
  });

export type ISelectedProcessData = Instance<typeof SelectedProcessData>;
