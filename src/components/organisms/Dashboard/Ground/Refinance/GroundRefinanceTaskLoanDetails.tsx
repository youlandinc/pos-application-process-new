import { FC, useCallback, useMemo, useState } from 'react';
import { Stack } from '@mui/material';
import { useRouter } from 'next/router';
import { useAsync } from 'react-use';
import { useSnackbar } from 'notistack';
import { format, isDate, isValid } from 'date-fns';

import { _fetchTaskFormInfo, _updateTaskFormInfo } from '@/requests/dashboard';
import {
  AUTO_HIDE_DURATION,
  OPTIONS_COMMON_YES_OR_NO,
  OPTIONS_TASK_EXIT_STRATEGY,
} from '@/constants';
import { DashboardTaskExitStrategy } from '@/types';
import { POSNotUndefined } from '@/utils';

import {
  StyledButton,
  StyledButtonGroup,
  StyledDatePicker,
  StyledFormItem,
  StyledLoading,
  StyledSelectOption,
  StyledTextFieldNumber,
  Transitions,
} from '@/components/atoms';
import { useSessionStorageState } from '@/hooks';

export const GroundRefinanceTaskLoanDetails: FC = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { saasState } = useSessionStorageState('tenantConfig');
  const [saveLoading, setSaveLoading] = useState<boolean>(false);

  const [homeValue, setHomeValue] = useState<number | undefined>();
  const [balance, setBalance] = useState<number | undefined>();

  const [isCashOut, setIsCashOut] = useState<boolean | undefined>();
  const [cashOutAmount, setCashOutAmount] = useState<number | undefined>();

  const [cor, setCor] = useState<number | undefined>();
  const [corDate, setCorDate] = useState<unknown | Date | null>(null);
  const [arv, setArv] = useState<number | undefined>();

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
        const {
          homeValue,
          balance,
          isCashOut,
          cashOutAmount,
          cor,
          corDate,
          arv,
          exitStrategy,
        } = res.data;

        setHomeValue(homeValue || undefined);
        setBalance(balance || undefined);

        setIsCashOut(isCashOut ?? undefined);
        setCashOutAmount(cashOutAmount || undefined);

        setCor(cor || undefined);
        if (corDate) {
          setCorDate(new Date(corDate));
        }
        setArv(arv || undefined);

        setExitStrategy(
          (exitStrategy as DashboardTaskExitStrategy) || undefined,
        );
      })
      .catch((err) =>
        enqueueSnackbar(err as string, {
          variant: 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
          onClose: () =>
            router.push({
              pathname: '/dashboard/tasks',
              query: { processId: router.query.processId },
            }),
        }),
      );
  }, [router.query.taskId]);

  const isDisabled = useMemo(() => {
    const dateValid = isValid(corDate) && isDate(corDate);
    const condition = POSNotUndefined(isCashOut);

    if (!condition) {
      return false;
    }

    if (isCashOut) {
      if (!POSNotUndefined(cashOutAmount)) {
        return false;
      }
      return (!!homeValue && !!balance && !!exitStrategy) || dateValid;
    }

    return (
      (!!homeValue && !!balance && !!exitStrategy) || cor || arv || dateValid
    );
  }, [
    arv,
    balance,
    cashOutAmount,
    cor,
    corDate,
    exitStrategy,
    homeValue,
    isCashOut,
  ]);

  const handledSubmit = useCallback(async () => {
    const dateValid = isValid(corDate) && isDate(corDate);
    setSaveLoading(true);
    const postData = {
      taskId: router.query.taskId as string,
      taskForm: {
        arv,
        balance,
        cashOutAmount,
        cor,
        corDate: dateValid
          ? format(corDate as Date, 'yyyy-MM-dd O')
          : undefined,
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
    } catch (e) {
      enqueueSnackbar(e as string, {
        variant: 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
      });
    } finally {
      setSaveLoading(false);
    }
  }, [
    arv,
    balance,
    cashOutAmount,
    cor,
    corDate,
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
            maxWidth={900}
            mx={{ lg: 'auto', xs: 0 }}
            px={{ lg: 3, xs: 0 }}
            tip={
              'Below are all of the details we have about your deal. If you have to change these details you may do so below, please note that changes may affect your Loan-to-value or your rate.'
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

            <StyledFormItem label={'Payoff amount'} sub>
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

            <StyledFormItem label={'Will you request cash out?'} sub>
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
                gap: 48,
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

            <StyledFormItem
              label={'Estimated Rehab Loan Amount'}
              sub
              tip={`Total cost that you would like ${
                //sass
                saasState?.organizationName || 'YouLand'
              } to finance.`}
            >
              <Stack maxWidth={600} width={'100%'}>
                <StyledTextFieldNumber
                  label={'Estimated Rehab Loan Amount'}
                  onValueChange={({ floatValue }) => {
                    setCor(floatValue);
                  }}
                  prefix={'$'}
                  value={cor}
                />
              </Stack>
            </StyledFormItem>
            <StyledFormItem
              label={'Estimated date to finish your rehab project'}
              sub
            >
              <Stack maxWidth={600} width={'100%'}>
                <StyledDatePicker
                  disableFuture={false}
                  disablePast={false}
                  label={'MM/DD/YYYY'}
                  onChange={(date) => {
                    setCorDate(date);
                  }}
                  //validate={}
                  value={corDate}
                />
              </Stack>
            </StyledFormItem>
            <StyledFormItem
              label={'After repair value'}
              sub
              tip={
                'Once all improvements to the property have been made, how much will the property be worth?'
              }
            >
              <Stack maxWidth={600} width={'100%'}>
                <StyledTextFieldNumber
                  label={'After repair property value'}
                  onValueChange={({ floatValue }) => {
                    setArv(floatValue);
                  }}
                  prefix={'$'}
                  value={arv}
                />
              </Stack>
            </StyledFormItem>

            <StyledFormItem label={'Exit strategy'} sub>
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
                Save
              </StyledButton>
            </Stack>
          </StyledFormItem>
        )}
      </Transitions>
    </>
  );
};
