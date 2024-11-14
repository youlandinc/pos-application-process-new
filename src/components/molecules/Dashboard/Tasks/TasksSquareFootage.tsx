import { FC, useMemo, useState } from 'react';
import { Fade, Stack, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useAsync } from 'react-use';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

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

export const TasksSquareFootage: FC = observer(() => {
  const { enqueueSnackbar } = useSnackbar();
  const {
    dashboardInfo: { jumpToNextTask },
  } = useMst();

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
      await jumpToNextTask(DashboardTaskKey.square_footage);
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
        flexDirection={'row'}
        gap={3}
        justifyContent={'space-between'}
        width={'100%'}
      >
        <Stack
          gap={3}
          justifyContent={'flex-start'}
          maxWidth={900}
          width={'100%'}
        >
          <Typography fontSize={{ xs: 20, lg: 24 }}>
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
            sx={{ maxWidth: 600 }}
            value={squareFootage}
          />

          <StyledButton
            color={'primary'}
            disabled={saveLoading || !isFormDataValid}
            loading={saveLoading}
            onClick={handleSave}
            sx={{ mt: { xs: 3, lg: 5 }, width: 200 }}
          >
            Save and continue
          </StyledButton>
        </Stack>

        {['lg', 'xl', 'xxl'].includes(breakpoints) && <TasksRightMenu />}
      </Stack>
    </Fade>
  );
});
