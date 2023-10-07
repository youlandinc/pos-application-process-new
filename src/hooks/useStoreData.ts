import { HttpError } from '@/types';
import { useAsyncFn } from 'react-use';
import { useSnackbar } from 'notistack';

import { useMst } from '@/models/Root';

import { AUTO_HIDE_DURATION } from '@/constants';
import { _bindProcess, _updateTask, _updateTaskVariables } from '@/requests';
import { ServerTaskKey } from '@/types/enum';
import { usePersistFn } from './index';

export const useStoreData = () => {
  const { enqueueSnackbar } = useSnackbar();

  const { bpmn } = useMst();
  const { taskId } = bpmn;

  const [updateState, updateTaskVariables] = useAsyncFn(
    async (variables: Variable<any>[]) => {
      return await _updateTaskVariables(taskId as string, variables)
        .then((res) => res)
        .catch((err) => {
          const { header, message, variant } = err as HttpError;
          enqueueSnackbar(message, {
            variant: variant || 'error',
            autoHideDuration: AUTO_HIDE_DURATION,
            isSimple: !header,
            header,
          });
        });
    },
    [taskId],
  );

  const [completeTaskState, completeTask] = useAsyncFn(
    async (tId?: string) => {
      return await _updateTask(tId || (taskId as string), 'complete')
        .then((res) => res)
        .catch((err) => {
          const { header, message, variant } = err as HttpError;
          enqueueSnackbar(message, {
            variant: variant || 'error',
            autoHideDuration: AUTO_HIDE_DURATION,
            isSimple: !header,
            header,
          });
        });
    },
    [taskId],
  );

  const [changeTaskState, changeTask] = useAsyncFn(
    async (newActivityKey, taskId) => {
      return await _updateTask(taskId, 'change', newActivityKey)
        .then((res) => res)
        .catch((err) => {
          const { header, message, variant } = err as HttpError;
          enqueueSnackbar(message, {
            variant: variant || 'error',
            autoHideDuration: AUTO_HIDE_DURATION,
            isSimple: !header,
            header,
          });
        });
    },
    [taskId],
  );

  const handledNextTask = usePersistFn(
    async (
      variables: Variable<any>[],
      successCb?: (TaskData: any) => void,
    ): Promise<void> => {
      const res = await updateTaskVariables(variables).catch((err) => {
        const { header, message, variant } = err as HttpError;
        enqueueSnackbar(message, {
          variant: variant || 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
          isSimple: !header,
          header,
        });
      });
      if (res) {
        const nextTask = await completeTask();
        if (nextTask) {
          const {
            extra: { id: taskId },
            bpmn: { key: ServerTaskKey },
          } = nextTask.data[0];
          bpmn.setTaskId(taskId);
          bpmn.setTaskKey(ServerTaskKey);
          if (successCb) {
            successCb(nextTask.data[0]);
          }
        }
      }
    },
  );

  const handledPrevTask = usePersistFn(
    async (
      targetKey: ServerTaskKey,
      successCb?: (task: TaskData) => void,
    ): Promise<void> => {
      const prevTask = await changeTask(targetKey, taskId);
      if (prevTask) {
        const {
          extra: { id: taskId },
          bpmn: { key: ServerTaskKey },
        } = prevTask.data[0];
        bpmn.setTaskId(taskId);
        bpmn.setTaskKey(ServerTaskKey);
        if (successCb) {
          successCb(prevTask.data[0]);
        }
      }
    },
  );

  const bindProcess = usePersistFn(() => {
    _bindProcess(bpmn.processId as string)
      .then((res) => {
        //eslint-disable-next-line no-console
        console.log(res, 'bindSuccess');
      })
      .catch((err) => {
        const { header, message, variant } = err as HttpError;
        enqueueSnackbar(message, {
          variant: variant || 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
          isSimple: !header,
          header,
        });
      });
  });

  return {
    bpmn,
    updateState,
    updateTaskVariables,
    completeTaskState,
    completeTask,
    changeTaskState,
    changeTask,
    handledNextTask,
    handledPrevTask,
    bindProcess,
  };
};
