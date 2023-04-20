import { useAsyncFn } from 'react-use';
import { _bindProcess, _updateTask, _updateTaskVariables } from '@/requests';
import { useMst } from '@/models/Root';
import { ServerTaskKey } from '@/types/enum';
import { usePersistFn } from '@/hooks/usePersistFn';

export const useStoreData = () => {
  const { bpmn } = useMst();
  const { taskId } = bpmn;
  const [updateState, updateTaskVariables] = useAsyncFn(
    async (variables: Variable[]) => {
      return await _updateTaskVariables(taskId, variables)
        .then((res) => res)
        .catch((err) => {
          console.log(err);
        });
    },
    [taskId],
  );

  const [completeTaskState, completeTask] = useAsyncFn(
    async (tId?: string) => {
      return await _updateTask(tId || taskId, 'complete')
        .then((res) => res)
        .catch((err) => {
          console.log(err);
        });
    },
    [taskId],
  );

  const [changeTaskState, changeTask] = useAsyncFn(
    async (newActivityKey, taskId) => {
      return await _updateTask(taskId, 'change', newActivityKey)
        .then((res) => res)
        .catch((err) => {
          console.log(err);
        });
    },
    [taskId],
  );

  const handledNextTask = usePersistFn(
    async (variables: Variable[], successCb?: (TaskData) => void) => {
      const res = await updateTaskVariables(variables).catch((err) => {
        console.log(err);
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
    async (targetKey: ServerTaskKey, successCb?: (task: TaskData) => void) => {
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
    _bindProcess(bpmn.processId)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
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
