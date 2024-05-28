import { FC, useState } from 'react';
import { Fade, Stack, Typography } from '@mui/material';
import { useAsync } from 'react-use';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';

import { AUTO_HIDE_DURATION } from '@/constants';
import { useBreakpoints } from '@/hooks';

import {
  StyledButton,
  StyledLoading,
  StyledUploadBox,
} from '@/components/atoms';

import { AccountRoleTaskKey, HttpError, TaskFiles } from '@/types';
import {
  _deleteRoleTaskFile,
  _fetchRoleTaskDetail,
  _updateRoleTaskDetail,
  _uploadRoleTaskFile,
} from '@/requests';

export const License: FC = () => {
  const router = useRouter();
  const breakpoints = useBreakpoints();
  const { enqueueSnackbar } = useSnackbar();

  const [uploadLoading, setUploadLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const [taskFiles, setTaskFiles] = useState<TaskFiles[]>([]);

  const { loading } = useAsync(async () => {
    try {
      const {
        data: { taskFiles },
      } = await _fetchRoleTaskDetail(AccountRoleTaskKey.license);
      setTaskFiles(taskFiles || []);
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
      });
      router.back();
    }
  });

  const onSuccess = async (files: FileList) => {
    setUploadLoading(true);

    try {
      const formData = new FormData();
      Array.from(files, (item) => {
        formData.append('files', item);
      });
      const { data } = await _uploadRoleTaskFile(
        formData,
        AccountRoleTaskKey.license,
      );
      setTaskFiles([...taskFiles, ...data]);
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

  const onDelete = async (index: number) => {
    const params = {
      taskKey: AccountRoleTaskKey.license,
      url: taskFiles[index]?.url,
    };
    try {
      await _deleteRoleTaskFile(params);
      const temp = JSON.parse(JSON.stringify(taskFiles));
      temp.splice(index, 1);
      setTaskFiles(temp);
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
      });
    }
  };

  const onClickSave = async () => {
    const params = {
      taskKey: AccountRoleTaskKey.license,
      taskForm: {
        taskFiles,
      },
    };

    setSaveLoading(true);
    try {
      await _updateRoleTaskDetail(params);
      await router.push({
        pathname: '/account/',
        query: {
          qualification: true,
        },
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
  };

  return loading ? (
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
    <Fade in={!loading}>
      <Stack
        gap={{ xs: 3, lg: 6 }}
        justifyContent={'flex-start'}
        maxWidth={900}
        mx={{ lg: 'auto', xs: 0 }}
        px={{ lg: 3, xs: 0 }}
        width={'100%'}
      >
        <Typography
          component={'div'}
          textAlign={'center'}
          variant={['xs', 'sm', 'md'].includes(breakpoints) ? 'h6' : 'h5'}
        >
          Broker license
          <Typography
            color={'text.secondary'}
            component={'p'}
            mt={1.5}
            variant={
              ['xs', 'sm', 'md'].includes(breakpoints) ? 'body3' : 'body1'
            }
          >
            If you&apos;re looking to provide loans in AZ, CA, MN, NC, NJ, NV,
            NY, OR, or UT, upload broker licenses.
          </Typography>
        </Typography>

        <Stack>
          <StyledUploadBox
            fileList={taskFiles || []}
            loading={uploadLoading || loading}
            onDelete={onDelete}
            onSuccess={onSuccess}
          />
        </Stack>

        <Stack
          alignItems={'center'}
          flexDirection={'row'}
          gap={3}
          justifyContent={'center'}
          mt={3}
        >
          <StyledButton
            color={'info'}
            onClick={() => router.back()}
            sx={{
              flex: 1,
              width: '100%',
              maxWidth: 276,
            }}
            variant={'text'}
          >
            Back
          </StyledButton>
          <StyledButton
            color={'primary'}
            disabled={taskFiles.length <= 0 || saveLoading || uploadLoading}
            loading={saveLoading}
            onClick={onClickSave}
            sx={{
              flex: 1,
              width: '100%',
              maxWidth: 276,
            }}
          >
            Save
          </StyledButton>
        </Stack>
      </Stack>
    </Fade>
  );
};
