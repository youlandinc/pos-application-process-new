import { FC, useCallback, useMemo, useState } from 'react';
import { Stack } from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useAsync } from 'react-use';

import { observer } from 'mobx-react-lite';

import { AUTO_HIDE_DURATION } from '@/constants';
import {
  _deleteTaskFile,
  _fetchTaskFormInfo,
  _skipLoanTask,
  _updateTaskFormInfo,
  _uploadTaskFile,
} from '@/requests/dashboard';
import { HttpError, TaskFiles } from '@/types';

import {
  StyledButton,
  StyledFormItem,
  StyledLoading,
  StyledUploadBox,
  Transitions,
} from '@/components/atoms';

export const BridgeRefinanceTaskUploadPictures: FC = observer(() => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [saveLoading, setSaveLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [skipLoading, setSkipLoading] = useState(false);

  const [picturesFiles, setPicturesFiles] = useState<TaskFiles[]>([]);

  const handledSuccess = async (files: FileList) => {
    setUploadLoading(true);

    const formData = new FormData();

    formData.append('fieldName', 'picturesFiles');
    Array.from(files, (item) => {
      formData.append('files', item);
    });
    try {
      const { data } = await _uploadTaskFile(
        formData,
        router.query.taskId as string,
      );
      setPicturesFiles([...picturesFiles, ...data]);
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
      });
    } finally {
      setUploadLoading(false);
    }
  };

  const handledDelete = async (index: number) => {
    try {
      await _deleteTaskFile(router.query.taskId as string, {
        fieldName: 'picturesFiles',
        fileUrl: picturesFiles[index]?.url,
      });
      const temp = JSON.parse(JSON.stringify(picturesFiles));
      temp.splice(index, 1);
      setPicturesFiles(temp);
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
        onClose: () =>
          router.push({
            pathname: '/dashboard/tasks',
            query: { processId: router.query.processId },
          }),
      });
    }
  };

  const { loading } = useAsync(async () => {
    if (!router.query.taskId) {
      await router.push({
        pathname: '/dashboard/tasks',
        query: { processId: router.query.processId },
      });
      return;
    }
    return await _fetchTaskFormInfo(router.query.taskId as string)
      .then((res) => {
        const { picturesFiles } = res.data;
        setPicturesFiles(picturesFiles || []);
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
  }, [router.query.taskId]);

  const isDisabled = useMemo(() => {
    return picturesFiles.length > 0;
  }, [picturesFiles.length]);

  const handledSubmit = useCallback(async () => {
    setSaveLoading(true);
    const postData = {
      taskId: router.query.taskId as string,
      taskForm: {
        picturesFiles,
      },
    };

    try {
      await _updateTaskFormInfo(postData);
      await router.push({
        pathname: '/dashboard/tasks',
        query: { processId: router.query.processId },
      });
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
      });
    } finally {
      setSaveLoading(false);
    }
  }, [enqueueSnackbar, picturesFiles, router]);

  const handledSkip = useCallback(async () => {
    setSkipLoading(true);
    try {
      await _skipLoanTask(router.query.taskId as string);
      await router.push({
        pathname: '/dashboard/tasks',
        query: { processId: router.query.processId },
      });
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
      });
    } finally {
      setSkipLoading(false);
    }
  }, [enqueueSnackbar, router]);

  return (
    <>
      <Transitions
        style={{
          display: 'flex',
          width: '100%',
          justifyContent: 'center',
        }}
      >
        {loading ? (
          <Stack
            alignItems={'center'}
            justifyContent={'center'}
            margin={'auto 0'}
            minHeight={'calc(667px - 46px)'}
            width={'100%'}
          >
            <StyledLoading sx={{ color: 'text.grey' }} />
          </Stack>
        ) : (
          <StyledFormItem
            gap={6}
            label={'Upload photos (optional)'}
            maxWidth={900}
            mx={{ lg: 'auto', xs: 0 }}
            px={{ lg: 3, xs: 0 }}
            tip={
              'Please upload photos of the subject property that are no more than 6 months old. The more photos you provide, the more accurately we can value the property and determine the feasibility of your project. If you do not provide adequate interior pictures of the subject property, we will assume C5-6 condition.'
            }
            tipSx={{ mb: 0 }}
            width={'100%'}
          >
            <StyledButton
              color={'info'}
              disabled={saveLoading || skipLoading}
              onClick={handledSkip}
              sx={{ width: '100%', maxWidth: 276 }}
              variant={'outlined'}
            >
              Skip
            </StyledButton>

            <StyledFormItem
              label={'Please upload the following:'}
              maxWidth={900}
              sub
              tip={
                '1.Kitchen (2-3), 2. Bedroom, 3. Bathroom, 4. Front of house, 5. Back of house, 6. Sides of house, 7. General (optional)'
              }
            >
              <StyledUploadBox
                fileList={picturesFiles}
                loading={uploadLoading}
                onDelete={handledDelete}
                onSuccess={handledSuccess}
              />
            </StyledFormItem>

            <Stack
              flexDirection={'row'}
              gap={3}
              justifyContent={'space-between'}
              maxWidth={600}
              width={'100%'}
            >
              <StyledButton
                color={'info'}
                onClick={() =>
                  router.push({
                    pathname: '/dashboard/tasks',
                    query: { processId: router.query.processId },
                  })
                }
                sx={{ flex: 1 }}
                variant={'text'}
              >
                Back
              </StyledButton>
              <StyledButton
                disabled={!isDisabled || saveLoading || skipLoading}
                loading={saveLoading}
                loadingText={'Saving...'}
                onClick={handledSubmit}
                sx={{ flex: 1 }}
              >
                Confirm
              </StyledButton>
            </Stack>
          </StyledFormItem>
        )}
      </Transitions>
    </>
  );
});
