import { Instance, types, SnapshotOut } from 'mobx-state-tree';
import { PipelineTaskKey } from '@/types/enum';
import {
  PipelineACH,
  PipelineAgreement,
  PipelineGovernment,
  PipelineLicense,
  PipelineQuestionnaire,
  PipelineTaskItem,
  PipelineW9,
} from '@/types/myApplicationData';
import {
  PTACH,
  PTAgreement,
  PTGovernment,
  PTLicense,
  PTQuestionnaire,
  PTW9,
} from '@/models/pipeline';
import tasks from '../../pages/dashboard/tasks';

export const PipelineTask = types
  .model({
    [PipelineTaskKey.AI]: PTACH,
    [PipelineTaskKey.BA]: PTAgreement,
    [PipelineTaskKey.BG]: PTGovernment,
    [PipelineTaskKey.BL]: PTLicense,
    [PipelineTaskKey.BQ]: PTQuestionnaire,
    [PipelineTaskKey.WF]: PTW9,
  })
  .actions((self) => {
    return {
      injectPipelineTaskData(data) {
        if (data) {
          for (const [key, value] of Object.entries(data)) {
            switch (key) {
              case PipelineTaskKey.BL:
                self[PipelineTaskKey.BL].injectPipelineTaskData(
                  value as PipelineTaskItem<PipelineLicense>,
                );
                break;
              case PipelineTaskKey.WF:
                self[PipelineTaskKey.WF].injectPipelineTaskData(
                  value as PipelineTaskItem<PipelineW9>,
                );
                break;
              case PipelineTaskKey.BG:
                self[PipelineTaskKey.BG].injectPipelineTaskData(
                  value as PipelineTaskItem<PipelineGovernment>,
                );
                break;
              case PipelineTaskKey.AI:
                self[PipelineTaskKey.AI].injectPipelineTaskData(
                  value as PipelineTaskItem<PipelineACH>,
                );
                break;
              case PipelineTaskKey.BA:
                self[PipelineTaskKey.BA].injectPipelineTaskData(
                  value as PipelineTaskItem<PipelineAgreement>,
                );
                break;
              case PipelineTaskKey.BQ:
                self[PipelineTaskKey.BQ].injectPipelineTaskData(
                  value as PipelineTaskItem<PipelineQuestionnaire>,
                );
                break;
            }
          }
        }
      },
      loadProcessData(taskData) {
        this.injectPipelineTaskData(taskData);
      },
      changeFieldValue<K extends keyof typeof self>(
        key: K,
        value: typeof self[K],
      ) {
        self[key] = value;
      },
    };
  });

export type IPipelineTask = Instance<typeof PipelineTask>;
export type SPipelineTask = SnapshotOut<typeof PipelineTask>;
