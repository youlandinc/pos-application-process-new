// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { SceneType } from '@/types';
import { flow, getParent, Instance, types } from 'mobx-state-tree';
import { _fetchProcessData } from '@/requests';
import { AxiosResponse } from 'axios';
import { ProcessData } from '@/types/server';
import { enqueueSnackbar } from 'notistack';
import { AUTO_HIDE_DURATION } from '@/constants';
//import { ParseProcess } from '@/services/ParseProcess';

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
    ),
  })
  .actions((self) => ({
    setProcessData(processData: ProcessData) {
      self.data = processData;
    },
    setScene(scene: SceneType) {
      self.scene = scene;
    },
  }))
  .actions((self) => {
    const fetchProcessData = flow(function* () {
      self.loading = true;
      try {
        const rootStore = getParent(self, 1);
        if (
          rootStore.userSetting &&
          rootStore.userSetting.setting.lastSelectedProcessId !== ''
        ) {
          const res: AxiosResponse<ProcessData> = yield _fetchProcessData(
            rootStore.userSetting.setting.lastSelectedProcessId,
          );
          self.loading = false;
          self.setProcessData(res.data);
          self.setScene(new ParseProcess(res.data).productType);
        }
      } catch (e) {
        self.loading = false;
        enqueueSnackbar(e as string, {
          variant: 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
        });
      }
    });
    return {
      fetchProcessData,
    };
  });

export type ISelectedProcessData = Instance<typeof SelectedProcessData>;
