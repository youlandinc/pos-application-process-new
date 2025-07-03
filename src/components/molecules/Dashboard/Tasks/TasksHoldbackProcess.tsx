import { FC, useRef, useState } from 'react';
import { Fade, Stack, Typography } from '@mui/material';
import { useAsync } from 'react-use';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { POSGetParamsFromUrl } from '@/utils';
import { useRenderPdf, useSessionStorageState } from '@/hooks';
import { AUTO_HIDE_DURATION } from '@/constants';

import { StyledButton, StyledLoading } from '@/components/atoms';

import { DashboardTaskKey, HttpError } from '@/types';
import {
  _fetchLoanTaskDetail,
  _updateLoanTaskDetail,
} from '@/requests/dashboard';

export const TasksHoldbackProcess: FC = observer(() => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const {
    dashboardInfo: { jumpToNextTask },
  } = useMst();

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
      await jumpToNextTask(DashboardTaskKey.holdback_process);
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
      minHeight={'calc(667px - 194px)'}
      width={'100%'}
    >
      <StyledLoading sx={{ color: 'text.grey' }} />
    </Stack>
  ) : (
    <Fade in={!loading}>
      <Stack
        gap={{ xs: 6, lg: 8 }}
        justifyContent={'flex-start'}
        maxWidth={900}
        width={'100%'}
      >
        <Typography component={'div'} fontSize={{ xs: 20, lg: 24 }}>
          Construction holdback process
          <Typography
            color={'text.secondary'}
            fontSize={{ xs: 12, lg: 16 }}
            mt={1}
            variant={'body1'}
          >
            Please review and accept{' '}
            {
              //sass
              saasState?.dbaName
            }
            &apos;s construction holdback process, which outlines how funds will
            be disbursed during your project&apos;s construction phase.
            {/*{`Review and accept $'s construction holdback process`}*/}
          </Typography>
        </Typography>

        <Stack
          border={'1px solid #DEDEDE'}
          borderRadius={2}
          boxShadow={'0px 3px 10px 0px #DEDEDE'}
          mt={-3}
          p={{ xs: 3, lg: 10 }}
          ref={pdfFile}
          width={'100%'}
        />

        <Typography
          color={'text.secondary'}
          fontSize={{ xs: 12, lg: 16 }}
          mt={{ xs: 0, lg: -2 }}
          variant={'body1'}
        >
          By clicking the <b style={{ fontWeight: 500 }}>Save</b> button below,
          I hereby agree to the above {saasState?.dbaName}&apos;s construction
          holdback process.
        </Typography>

        <StyledButton
          color={'primary'}
          disabled={saveLoading}
          loading={saveLoading}
          onClick={handleSave}
          sx={{ width: 276 }}
        >
          Save and continue
        </StyledButton>
      </Stack>
    </Fade>
  );
});
