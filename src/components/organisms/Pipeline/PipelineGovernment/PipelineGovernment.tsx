import { FC, useEffect, useState } from 'react';
import { Stack } from '@mui/material';

import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';

import { getSnapshot } from 'mobx-state-tree';
import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { TaskFiles } from '@/types';
import { _addTaskFile, _completePipelineTask, _deleteUpload } from '@/requests';
import { AUTO_HIDE_DURATION } from '@/constants';

import {
  StyledButton,
  StyledFormItem,
  StyledUploadBox,
} from '@/components/atoms';

export const PipelineGovernment: FC = observer(() => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const {
    pipelineTask: { pipelineInitialized, formData },
  } = useMst();

  const { BROKER_GOVERNMENT_ID } = formData;

  const [fileList, setFileList] = useState<TaskFiles[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);

  useEffect(
    () => {
      if (!pipelineInitialized) {
        return;
      }
      setFileList(getSnapshot(BROKER_GOVERNMENT_ID?.taskForm?.taskFiles));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pipelineInitialized],
  );

  const onSuccess = async (files: FileList) => {
    setUploadLoading(true);

    try {
      const formDatas = new FormData();
      Array.from(files, (item) => {
        formDatas.append('files', item);
      });
      const { data } = await _addTaskFile(
        formDatas,
        BROKER_GOVERNMENT_ID.taskId,
      );
      setFileList([...fileList, ...data]);
      data.forEach((item) => {
        BROKER_GOVERNMENT_ID.addFile(item);
      });
      setUploadLoading(false);
    } catch (err) {
      setUploadLoading(false);
      enqueueSnackbar(err as string, {
        variant: 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
      });
    }
  };

  const onDelete = async (index: number) => {
    try {
      await _deleteUpload(BROKER_GOVERNMENT_ID.taskId, {
        url: fileList[index]?.url,
      });
      const temp = JSON.parse(JSON.stringify(fileList));
      temp.splice(index, 1);
      setFileList(temp);
      BROKER_GOVERNMENT_ID.removeFile(index);
    } catch (err) {
      enqueueSnackbar(err as string, {
        variant: 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
      });
    }
  };

  const handledCompleteTaskAndBackToSummary = async () => {
    setLoading(true);
    const data = BROKER_GOVERNMENT_ID.getPostData();
    try {
      await _completePipelineTask(data);
      setLoading(false);
      await router.push('/pipeline/profile');
    } catch (err) {
      setLoading(false);
      enqueueSnackbar(err as string, {
        variant: 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
      });
    }
  };

  return (
    <Stack alignItems={'center'} justifyContent={'center'}>
      <StyledFormItem
        label={"Broker's government ID"}
        sx={{ width: '100%' }}
        tip={`Please upload your driver's license or government issued ID
            (driver's license, US passport, US military ID) to verify your
            identity.`}
      >
        <Stack alignItems={'center'} gap={3} width={'100%'}>
          <Stack width={'100%'}>
            <StyledUploadBox
              fileList={fileList || []}
              loading={uploadLoading}
              onDelete={onDelete}
              onSuccess={onSuccess}
            />
          </Stack>

          <Stack
            alignItems={'center'}
            flexDirection={{ sx: 'column', lg: 'row' }}
            gap={3}
            justifyContent={'center'}
            mt={{ lg: 3, xs: 0 }}
            width={{ lg: 600, xs: '100%' }}
          >
            <StyledButton
              color={'info'}
              onClick={() => router.back()}
              sx={{ flex: 1, width: '100%', order: { xs: 2, lg: 1 } }}
              variant={'text'}
            >
              Back
            </StyledButton>
            <StyledButton
              color={'primary'}
              disabled={fileList.length <= 0 || loading}
              loading={loading}
              onClick={() => handledCompleteTaskAndBackToSummary()}
              sx={{ flex: 1, width: '100%', order: { xs: 1, lg: 2 } }}
            >
              Save
            </StyledButton>
          </Stack>
        </Stack>
      </StyledFormItem>
    </Stack>
  );
});
