import { FC, useState } from 'react';
import { Fade, Stack, Typography } from '@mui/material';
import { useAsync } from 'react-use';
import { useSnackbar } from 'notistack';

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

export const TasksPayoffAmount: FC = observer(() => {
  const { enqueueSnackbar } = useSnackbar();
  const {
    dashboardInfo: { jumpToNextTask },
  } = useMst();

  const [saveLoading, setSaveLoading] = useState(false);

  const [payoffAmount, setPayoffAmount] = useState<number | undefined>();

  const { loading } = useAsync(async () => {
    const { loanId } = POSGetParamsFromUrl(location.href);
    if (!loanId) {
      return;
    }
    try {
      const {
        data: {
          data: { payoffAmount },
        },
      } = await _fetchLoanTaskDetail({
        loanId,
        taskKey: DashboardTaskKey.payoff_amount,
      });
      setPayoffAmount(payoffAmount);
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
      loanId: POSGetParamsFromUrl(location.href).loanId,
      taskKey: DashboardTaskKey.payoff_amount,
      data: {
        payoffAmount,
      },
    };
    setSaveLoading(true);
    try {
      await _updateLoanTaskDetail(postData);
      await jumpToNextTask(DashboardTaskKey.payoff_amount);
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
        gap={3}
        justifyContent={'flex-start'}
        maxWidth={900}
        width={'100%'}
      >
        <Typography fontSize={{ xs: 20, lg: 24 }}>
          Payoff amount
          <Typography
            color={'text.secondary'}
            fontSize={{ xs: 12, lg: 16 }}
            mt={1}
            variant={'body1'}
          >
            Please provide the full amount due to your lender for the complete
            repayment of your current loan.
          </Typography>
        </Typography>

        <StyledTextFieldNumber
          label={'Payoff amount'}
          onValueChange={({ floatValue }) => setPayoffAmount(floatValue)}
          placeholder={'Payoff amount'}
          prefix={'$'}
          sx={{ maxWidth: 600 }}
          value={payoffAmount}
        />

        <StyledButton
          color={'primary'}
          disabled={saveLoading || !payoffAmount}
          loading={saveLoading}
          onClick={handleSave}
          sx={{ width: 200, mt: { xs: 3, lg: 5 } }}
        >
          Save and continue
        </StyledButton>
      </Stack>
    </Fade>
  );
});
