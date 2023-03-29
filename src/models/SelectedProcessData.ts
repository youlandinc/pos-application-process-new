import { flow, getParent, Instance, types } from 'mobx-state-tree';
import { _fetchProcessData } from '@/requests';
import { AxiosResponse } from 'axios';
import { ProcessData } from '@/types/server';
import { ParseProcess } from '@/services/ParseProcess';

export const SelectedProcessData = types
  .model({
    data: types.maybe(types.frozen<ProcessData>()),
    loading: types.boolean,
    scene: types.union(
      types.literal(''),
      types.literal('Unknown'),
      types.literal('mortgage purchase'),
      types.literal('mortgage refinance'),
      types.literal('bridge purchase'),
      types.literal('bridge refinance'),
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
        console.log(e);
        self.loading = false;
      }
    });
    return {
      fetchProcessData,
    };
  });

export type ISelectedProcessData = Instance<typeof SelectedProcessData>;
