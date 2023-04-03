import { flow, Instance, types } from 'mobx-state-tree';
import { PipelineTask, SPipelineTask } from './PTask';
import { FormData } from '@/constants/formData';
import { _fetchPipelineTask } from '@/requests';

const Union = types.union({
  dispatcher: (snapshot: SPipelineTask | undefined) => {
    if (!snapshot) {
      return types.undefined;
    }
    return PipelineTask;
  },
});

export const PipelineTaskForm = types
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
      }
    });
    return {
      fetchPipelineTaskData,
    };
  });

export type IPipelineTaskForm = Instance<typeof PipelineTaskForm>;
