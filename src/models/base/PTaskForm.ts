import { flow, Instance, SnapshotOut, types } from 'mobx-state-tree';
//import { enqueueSnackbar } from 'notistack';
import {
  //AUTO_HIDE_DURATION,
  FormData,
} from '@/constants';
import { _fetchPipelineTask } from '@/requests';

import { PTask, SPTask } from '@/models/pipeline/PTask';

const Union = types.union({
  dispatcher: (snapshot: SPTask | undefined) => {
    if (!snapshot) {
      return types.undefined;
    }
    return PTask;
  },
});

export const PTaskForm = types
  .model({
    formData: Union,
    pipelineInitialized: types.boolean,
  })
  .actions((self) => ({
    initPipelineTaskForm() {
      self.formData = FormData.pipelineTaskDefaultData;
    },
    setInitialized(initialized: boolean) {
      self.pipelineInitialized = initialized;
    },
  }))
  .actions((self) => {
    const fetchPipelineTaskData = flow(function* () {
      try {
        const res = yield _fetchPipelineTask();
        self.formData.injectPipelineTaskData(res.data);
        self.setInitialized(true);
      } catch (e) {
        //eslint-disable-next-line no-console
        console.log(e);
        //enqueueSnackbar(e as string, {
        //  variant: 'error',
        //  autoHideDuration: AUTO_HIDE_DURATION,
        //});
      }
    });
    return {
      fetchPipelineTaskData,
    };
  });

export type IPTaskForm = Instance<typeof PTaskForm>;
export type SPTaskForm = SnapshotOut<typeof PTaskForm>;
