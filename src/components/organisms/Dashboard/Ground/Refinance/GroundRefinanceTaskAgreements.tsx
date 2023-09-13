import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { CloseOutlined } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';

import { observer } from 'mobx-react-lite';

import { AUTO_HIDE_DURATION } from '@/constants';
import {
  _fetchAttachmentFile,
  _updateTaskFormInfo,
} from '@/requests/dashboard';
import { useRenderPdf, useSessionStorageState, useSwitch } from '@/hooks';

import { StyledButton, StyledDialog, StyledFormItem } from '@/components/atoms';

export const GroundRefinanceTaskAgreements: FC = observer(() => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const { saasState } = useSessionStorageState('tenantConfig');

  const { visible, open, close } = useSwitch(false);

  const pdfFile = useRef(null);

  const { renderFile } = useRenderPdf(pdfFile);

  const [saveLoading, setSaveLoading] = useState(false);
  const [viewLoading, setViewLoading] = useState<boolean>(false);

  const [pdfString, setPdfString] = useState<string>('');

  useEffect(() => {
    if (router.query.taskId) {
      return;
    }
    router.push({
      pathname: '/dashboard/tasks',
      query: { processId: router.query.processId },
    });
  }, [router]);

  const handledSubmit = useCallback(async () => {
    setSaveLoading(true);
    const postData = {
      taskId: router.query.taskId as string,
      taskForm: {},
    };

    try {
      await _updateTaskFormInfo(postData);
      await router.push({
        pathname: '/dashboard/tasks',
        query: { processId: router.query.processId },
      });
    } catch (e) {
      enqueueSnackbar(e as string, {
        variant: 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
      });
    } finally {
      setSaveLoading(false);
    }
  }, [enqueueSnackbar, router]);

  const handledViewPDF = useCallback(async () => {
    if (pdfString) {
      open();
      setTimeout(() => {
        renderFile(pdfString);
      }, 100);
      return;
    }
    setViewLoading(true);
    try {
      const { data } = await _fetchAttachmentFile();
      setPdfString(data);
      open();
      setTimeout(() => {
        renderFile(data);
      }, 100);
    } catch (err) {
      enqueueSnackbar(err as string, {
        variant: 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
      });
    } finally {
      setViewLoading(false);
    }
  }, [enqueueSnackbar, open, pdfString, renderFile]);

  return (
    <>
      <StyledFormItem
        gap={3}
        label={`Review and accept ${
          //sass
          saasState?.organizationName || ' YouLand'
        }'s construction holdback process`}
        maxWidth={900}
      >
        <Typography
          className={'link_style'}
          component={'span'}
          fontWeight={600}
          onClick={handledViewPDF}
        >
          View construction holdback process
        </Typography>

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
            disabled={saveLoading || viewLoading}
            loading={saveLoading}
            loadingText={'Saving...'}
            onClick={handledSubmit}
            sx={{ flex: 1 }}
          >
            Confirm
          </StyledButton>
        </Stack>
      </StyledFormItem>

      <StyledDialog
        content={<Box ref={pdfFile} />}
        disableEscapeKeyDown
        header={
          <Stack
            alignItems={'center'}
            flexDirection={'row'}
            justifyContent={'space-between'}
            pb={3}
          >
            <Typography variant={'h6'}>
              Construction Holdback Process
            </Typography>
            <StyledButton isIconButton onClick={close}>
              <CloseOutlined />
            </StyledButton>
          </Stack>
        }
        open={visible}
        sx={{
          '& .MuiPaper-root': {
            maxWidth: { lg: '900px !important', xs: '100% !important' },
            width: '100%',
            '& .MuiDialogTitle-root, & .MuiDialogActions-root': {
              bgcolor: '#F5F8FA',
              p: 3,
            },
          },
        }}
      />
    </>
  );
});
