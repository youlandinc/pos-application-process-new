import { FC, useMemo, useState } from 'react';
import { Fade, Stack, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useAsync } from 'react-use';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { AUTO_HIDE_DURATION } from '@/constants';
import { POSGetParamsFromUrl } from '@/utils';

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

export const TasksRehabInfo: FC = observer(() => {
  const { enqueueSnackbar } = useSnackbar();
  const {
    dashboardInfo: { jumpToNextTask },
  } = useMst();

  const [saveLoading, setSaveLoading] = useState(false);

  const [arv, setArv] = useState<number | undefined>();
  const [square, setSquare] = useState<number | undefined>();

  const { loading } = useAsync(async () => {
    const { loanId } = POSGetParamsFromUrl(location.href);
    if (!loanId) {
      return;
    }
    try {
      const {
        data: {
          data: { arv, square },
        },
      } = await _fetchLoanTaskDetail({
        loanId,
        taskKey: DashboardTaskKey.rehab_info,
      });
      setArv(arv || undefined);
      setSquare(square || undefined);
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
    return !!arv && !!square;
  }, [arv, square]);

  const handleSave = async () => {
    const postData = {
      loanId: POSGetParamsFromUrl(location.href).loanId,
      taskKey: DashboardTaskKey.rehab_info,
      data: {
        arv,
        square,
      },
    };
    setSaveLoading(true);
    try {
      await _updateLoanTaskDetail(postData);
      await jumpToNextTask(DashboardTaskKey.rehab_info);
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
          Rehab info
          <Typography
            color={'text.secondary'}
            fontSize={{ xs: 12, lg: 16 }}
            mt={1}
            variant={'body1'}
          >
            Please provide some more information about the value of the property
            as it is now and the planned after-repair square footage.
          </Typography>
        </Typography>

        <Stack gap={3} maxWidth={600} mt={-3} width={'100%'}>
          <StyledTextFieldNumber
            label={'After repair value (ARV)'}
            onValueChange={({ floatValue }) => setArv(floatValue)}
            placeholder={'After repair value (ARV)'}
            prefix={'$'}
            value={arv}
          />

          <StyledTextFieldNumber
            label={'After-repair square footage'}
            onValueChange={({ floatValue }) => setSquare(floatValue)}
            placeholder={'After-repair square footage'}
            suffix={' Sq ft'}
            value={square}
          />
        </Stack>

        <StyledButton
          color={'primary'}
          disabled={saveLoading || !isFormDataValid}
          loading={saveLoading}
          onClick={handleSave}
          sx={{ maxWidth: 276 }}
        >
          Save and continue
        </StyledButton>
      </Stack>
    </Fade>
  );
});
