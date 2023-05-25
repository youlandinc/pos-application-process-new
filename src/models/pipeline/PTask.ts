import { Instance, SnapshotOut, types } from 'mobx-state-tree';
import {
  PTACH,
  PTACHNotBroker,
  PTAgreement,
  PTAgreementNotBroker,
  PTGovernment,
  PTLicense,
  PTQuestionnaire,
  PTW9,
} from './base';

import {
  PipelineACH,
  PipelineAgreement,
  PipelineGovernment,
  PipelineLicense,
  PipelineQuestionnaire,
  PipelineTaskItem,
  PipelineTaskKey,
  PipelineTasksMap,
  PipelineW9,
} from '@/types/pipeline';

export const PTask = types
  .model({
    [PipelineTaskKey.AI]: PTACH,
    [PipelineTaskKey.BA]: PTAgreement,
    [PipelineTaskKey.BG]: PTGovernment,
    [PipelineTaskKey.BL]: PTLicense,
    [PipelineTaskKey.BQ]: PTQuestionnaire,
    [PipelineTaskKey.WF]: PTW9,
    [PipelineTaskKey.LOA]: PTAgreementNotBroker,
    [PipelineTaskKey.REAA]: PTAgreementNotBroker,
    [PipelineTaskKey.LOI]: PTACHNotBroker,
    [PipelineTaskKey.REAI]: PTACHNotBroker,
  })
  .actions((self) => {
    return {
      injectPipelineTaskData(data: Partial<PipelineTasksMap>) {
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
              case PipelineTaskKey.LOA:
                self[PipelineTaskKey.LOA].injectPipelineTaskData(
                  value as PipelineTaskItem<PipelineAgreement>,
                );
                break;
              case PipelineTaskKey.REAA:
                self[PipelineTaskKey.REAA].injectPipelineTaskData(
                  value as PipelineTaskItem<PipelineAgreement>,
                );
                break;
              case PipelineTaskKey.LOI:
                self[PipelineTaskKey.LOI].injectPipelineTaskData(
                  value as PipelineTaskItem<PipelineACH>,
                );
                break;
              case PipelineTaskKey.REAI:
                self[PipelineTaskKey.REAI].injectPipelineTaskData(
                  value as PipelineTaskItem<PipelineACH>,
                );
                break;
            }
          }
        }
      },
      loadProcessData(taskData: Partial<PipelineTasksMap>) {
        this.injectPipelineTaskData(taskData);
      },
      changeFieldValue<K extends keyof typeof self>(
        key: K,
        value: (typeof self)[K],
      ) {
        self[key] = value;
      },
    };
  });

export type IPTask = Instance<typeof PTask>;
export type SPTask = SnapshotOut<typeof PTask>;
