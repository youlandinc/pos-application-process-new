import { FC, useMemo, useState } from 'react';
import { Fade, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useAsync } from 'react-use';

import { useBreakpoints } from '@/hooks';
import { POSGetParamsFromUrl } from '@/utils';
import { AUTO_HIDE_DURATION } from '@/constants';

import {
  StyledButton,
  StyledLoading,
  StyledTextFieldNumber,
} from '@/components/atoms';

import { DashboardTaskKey, HttpError } from '@/types';
import {
  _fetchLoanTaskDetail,
  _updateLoanTaskDetail,
} from '@/requests/dashboard';
import { TasksRightMenu } from '@/components/molecules';

export const TasksSquareFootage: FC = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const breakpoints = useBreakpoints();

  const [saveLoading, setSaveLoading] = useState(false);

  const [squareFootage, setSquareFootage] = useState<number | undefined>();

  const { loading } = useAsync(async () => {
    const { loanId } = POSGetParamsFromUrl(location.href);
    if (!loanId) {
      return;
    }
    try {
      const {
        data: {
          data: { squareFootage },
        },
      } = await _fetchLoanTaskDetail({
        loanId,
        taskKey: DashboardTaskKey.square_footage,
      });
      setSquareFootage(squareFootage || undefined);
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

  const isFormDataValid = useMemo(() => {
    return !!squareFootage;
  }, [squareFootage]);

  const handleSave = async () => {
    const postData = {
      loanId: POSGetParamsFromUrl(location.href).loanId,
      taskKey: DashboardTaskKey.square_footage,
      data: {
        squareFootage,
      },
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
      <Stack flexDirection={'row'} justifyContent={'center'} width={'100%'}>
        <Stack
          alignItems={'center'}
          gap={6}
          justifyContent={'flex-start'}
          maxWidth={648}
          mx={{ lg: 'auto', xs: 0 }}
          px={{ lg: 3, xs: 0 }}
          width={'100%'}
        >
          <Typography
            color={'text.primary'}
            fontSize={{ xs: 20, lg: 24 }}
            textAlign={'center'}
            variant={'h5'}
          >
            Square footage
            <Typography
              color={'text.secondary'}
              fontSize={{ xs: 12, lg: 16 }}
              mt={1}
              variant={'body1'}
            >
              Please provide the square footage of the planned property
            </Typography>
          </Typography>

          <StyledTextFieldNumber
            label={'Square footage'}
            onValueChange={({ floatValue }) => setSquareFootage(floatValue)}
            placeholder={'Square footage (ex: 1000 sq ft)'}
            suffix={' Sq ft'}
            value={squareFootage}
          />

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
              sx={{ flex: 1, width: '100%' }}
              variant={'text'}
            >
              Back
            </StyledButton>
            <StyledButton
              color={'primary'}
              disabled={saveLoading || !isFormDataValid}
              loading={saveLoading}
              onClick={handleSave}
              sx={{ flex: 1, width: '100%' }}
            >
              Save
            </StyledButton>
          </Stack>
        </Stack>
        {['xl', 'xxl'].includes(breakpoints) && <TasksRightMenu />}
      </Stack>
    </Fade>
  );
};
