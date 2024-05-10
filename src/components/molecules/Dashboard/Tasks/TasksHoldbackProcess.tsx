import { FC, useRef, useState } from 'react';
import { Fade, Stack, Typography } from '@mui/material';
import { useAsync } from 'react-use';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';

import { AUTO_HIDE_DURATION } from '@/constants';
import { POSGetParamsFromUrl } from '@/utils';
import { useRenderPdf, useSessionStorageState } from '@/hooks';

import {
  StyledButton,
  StyledFormItem,
  StyledLoading,
} from '@/components/atoms';

import { DashboardTaskKey, HttpError } from '@/types';
import {
  _fetchLoanTaskDetail,
  _updateLoanTaskDetail,
} from '@/requests/dashboard';

export const TasksHoldbackProcess: FC = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const { saasState } = useSessionStorageState('tenantConfig');

  const pdfFile = useRef(null);
  const { renderFile } = useRenderPdf(pdfFile);

  const [saveLoading, setSaveLoading] = useState(false);

  const { loading } = useAsync(async () => {
    const { loanId } = POSGetParamsFromUrl(location.href);
    if (!loanId) {
      return;
    }
    try {
      const {
        data: {
          data: { fileHtml },
        },
      } = await _fetchLoanTaskDetail({
        loanId,
        taskKey: DashboardTaskKey.holdback_process,
      });
      setTimeout(() => {
        renderFile(fileHtml);
      }, 50);
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
            query: { loanId: router.query.loanId },
          }),
      });
    }
  }, []);

  const handleSave = async () => {
    const postData = {
      data: {},
      loanId: router.query.loanId as string,
      taskKey: DashboardTaskKey.holdback_process,
    };

    setSaveLoading(true);
    try {
      await _updateLoanTaskDetail(postData);
      await router.push({
        pathname: '/dashboard/tasks',
        query: { loanId: router.query.loanId },
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
        alignItems={'center'}
        gap={6}
        justifyContent={'flex-start'}
        maxWidth={900}
        mx={{ lg: 'auto', xs: 0 }}
        px={{ lg: 3, xs: 0 }}
        width={'100%'}
      >
        <Typography color={'text.primary'} textAlign={'center'} variant={'h4'}>
          Agreements
        </Typography>

        <StyledFormItem
          gap={3}
          label={`Review and accept ${
            //sass
            saasState?.organizationName || ' YouLand'
          }'s construction holdback process`}
          width={'100%'}
        >
          <Stack
            border={'1px solid #DEDEDE'}
            borderRadius={2}
            boxShadow={'0px 3px 10px 0px #DEDEDE'}
            p={10}
            ref={pdfFile}
            width={'100%'}
          />
        </StyledFormItem>

        <Typography color={'text.secondary'} variant={'body1'}>
          By clicking the below button, I hereby agree to the above{' '}
          {saasState?.organizationName || ' YouLand'}&apos;s construction
          holdback process (on behalf of the borrower).
        </Typography>

        <Stack
          flexDirection={{ xs: 'unset', md: 'row' }}
          gap={3}
          maxWidth={600}
          width={'100%'}
        >
          <StyledButton
            color={'info'}
            onClick={async () => {
              await router.push({
                pathname: '/dashboard/tasks',
                query: { loanId: router.query.loanId },
              });
            }}
            sx={{ flex: 1, maxWidth: 276, width: '100%' }}
            variant={'text'}
          >
            Back
          </StyledButton>
          <StyledButton
            color={'primary'}
            disabled={saveLoading}
            loading={saveLoading}
            onClick={handleSave}
            sx={{ flex: 1, maxWidth: 276, width: '100%' }}
          >
            Save
          </StyledButton>
        </Stack>
      </Stack>
    </Fade>
  );
};
