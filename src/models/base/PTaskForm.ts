import { flow, Instance, SnapshotOut, types } from 'mobx-state-tree';
import { AUTO_HIDE_DURATION, FormData } from '@/constants';
import { PTask, SPTask } from '@/models/pipeline/PTask';
import { _fetchPipelineTask } from '@/requests';
import { enqueueSnackbar } from 'notistack';

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
