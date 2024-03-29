import { FC, useCallback, useMemo, useState } from 'react';
import { Stack } from '@mui/material';
import { useRouter } from 'next/router';
import { useAsync } from 'react-use';
import { useSnackbar } from 'notistack';

import {
  AUTO_HIDE_DURATION,
  OPTIONS_COMMON_YES_OR_NO,
  OPTIONS_TASK_EXIT_STRATEGY,
} from '@/constants';
import { DashboardTaskExitStrategy, HttpError } from '@/types';
import { _fetchTaskFormInfo, _updateTaskFormInfo } from '@/requests/dashboard';
import { POSNotUndefined } from '@/utils';

import {
  StyledButton,
  StyledButtonGroup,
  StyledFormItem,
  StyledLoading,
  StyledSelectOption,
  StyledTextFieldNumber,
  Transitions,
} from '@/components/atoms';

export const BridgeRefinanceTaskLoanDetails: FC = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [saveLoading, setSaveLoading] = useState<boolean>(false);

  const [homeValue, setHomeValue] = useState<number | undefined>();
  const [balance, setBalance] = useState<number | undefined>();

  const [isCashOut, setIsCashOut] = useState<boolean | undefined>();
  const [cashOutAmount, setCashOutAmount] = useState<number | undefined>();

  const [exitStrategy, setExitStrategy] = useState<
    DashboardTaskExitStrategy | undefined
  >();

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
        const { homeValue, balance, isCashOut, cashOutAmount, exitStrategy } =
          res.data;

        setHomeValue(homeValue || undefined);
        setBalance(balance || undefined);

        setIsCashOut(isCashOut ?? undefined);
        setCashOutAmount(cashOutAmount || undefined);

        setExitStrategy(
          (exitStrategy as DashboardTaskExitStrategy) || undefined,
        );
      })
      .catch((err) => {
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
      });
  }, [router.query.taskId]);

  const isDisabled = useMemo(() => {
    const conditionA = POSNotUndefined(isCashOut);

    if (!conditionA) {
      return false;
    }
    if (isCashOut) {
      if (!POSNotUndefined(cashOutAmount)) {
        return false;
      }
      return !!homeValue && !!balance && !!exitStrategy;
    }

    return !!homeValue && !!balance && !!exitStrategy;
  }, [balance, cashOutAmount, exitStrategy, homeValue, isCashOut]);

  const handledSubmit = useCallback(async () => {
    setSaveLoading(true);
    const postData = {
      taskId: router.query.taskId as string,
      taskForm: {
        balance,
        cashOutAmount,
        exitStrategy,
        homeValue,
        isCashOut,
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
  }, [
    balance,
    cashOutAmount,
    enqueueSnackbar,
    exitStrategy,
    homeValue,
    isCashOut,
    router,
  ]);

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
            label={'Loan details'}
            mx={{ lg: 'auto', xs: 0 }}
            px={{ lg: 3, xs: 0 }}
            tip={
              'Below are all of the details we have about your deal. If you have to change these details, you may do so below. Please note that changes may affect your LTV (loan to value) or your rate.'
            }
            tipSx={{ mb: 0 }}
            width={'100%'}
          >
            <StyledFormItem label={'As-is property value'} sub>
              <Stack maxWidth={600} width={'100%'}>
                <StyledTextFieldNumber
                  label={'As-is property value'}
                  onValueChange={({ floatValue }) => {
                    setHomeValue(floatValue);
                  }}
                  prefix={'$'}
                  value={homeValue}
                />
              </Stack>
            </StyledFormItem>

            <StyledFormItem label={'Payoff amount'} mt={2} sub>
              <Stack maxWidth={600} width={'100%'}>
                <StyledTextFieldNumber
                  label={'Payoff amount'}
                  onValueChange={({ floatValue }) => {
                    setBalance(floatValue);
                  }}
                  prefix={'$'}
                  value={balance}
                />
              </Stack>
            </StyledFormItem>

            <StyledFormItem label={'Will you request cash out?'} mt={2} sub>
              <Stack maxWidth={600} width={'100%'}>
                <StyledButtonGroup
                  onChange={(e, value) => {
                    if (value !== null) {
                      setIsCashOut(value === 'yes');
                    }
                  }}
                  options={OPTIONS_COMMON_YES_OR_NO}
                  sx={{ width: '100%', maxWidth: 600 }}
                  value={isCashOut}
                />
              </Stack>
            </StyledFormItem>

            <Transitions
              style={{
                display: isCashOut ? 'flex' : 'none',
                flexDirection: 'column',
                gap: 64,
                width: '100%',
              }}
            >
              {isCashOut && (
                <StyledFormItem label={'Cash out amount'} sub>
                  <Stack maxWidth={600} width={'100%'}>
                    <StyledTextFieldNumber
                      label={'Cash out amount'}
                      onValueChange={({ floatValue }) => {
                        setCashOutAmount(floatValue);
                      }}
                      prefix={'$'}
                      value={cashOutAmount}
                    />
                  </Stack>
                </StyledFormItem>
              )}
            </Transitions>

            <StyledFormItem label={'Exit strategy'} mt={2} sub>
              <Stack maxWidth={600} width={'100%'}>
                <StyledSelectOption
                  onChange={(value) => {
                    setExitStrategy(value as DashboardTaskExitStrategy);
                  }}
                  options={OPTIONS_TASK_EXIT_STRATEGY}
                  value={exitStrategy}
                />
              </Stack>
            </StyledFormItem>

            <Stack
              flexDirection={'row'}
              gap={3}
              justifyContent={'space-between'}
              maxWidth={600}
              mt={4}
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
                disabled={!isDisabled || saveLoading}
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
};
