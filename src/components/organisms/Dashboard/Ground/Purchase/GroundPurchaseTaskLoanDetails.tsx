import { HttpError } from '@/types';
import { FC, useCallback, useMemo, useState } from 'react';
import { Stack } from '@mui/material';
import { useRouter } from 'next/router';
import { useAsync } from 'react-use';
import { useSnackbar } from 'notistack';
import { format, isDate, isValid } from 'date-fns';

import { AUTO_HIDE_DURATION } from '@/constants';
import { _fetchTaskFormInfo, _updateTaskFormInfo } from '@/requests/dashboard';

import {
  StyledButton,
  StyledDatePicker,
  StyledFormItem,
  StyledLoading,
  StyledTextFieldNumber,
  Transitions,
} from '@/components/atoms';
import { useSessionStorageState } from '@/hooks';

export const GroundPurchaseTaskLoanDetails: FC = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { saasState } = useSessionStorageState('tenantConfig');
  const [saveLoading, setSaveLoading] = useState<boolean>(false);

  const [purchasePrice, setPurchasePrice] = useState<number | undefined>();
  const [propertyValue, setPropertyValue] = useState<number | undefined>();
  const [cor, setCor] = useState<number | undefined>();
  const [corDate, setCorDate] = useState<unknown | Date | null>(null);
  const [arv, setArv] = useState<number | undefined>();

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
        const { purchasePrice, propertyValue, corDate, cor, arv } = res.data;
        setPurchasePrice(purchasePrice || undefined);
        setPropertyValue(propertyValue || undefined);
        if (corDate) {
          setCorDate(new Date(corDate));
        }
        setCor(cor || undefined);
        setArv(arv || undefined);
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
    const dateValid = isValid(corDate) && isDate(corDate);

    return !!purchasePrice && !!propertyValue && dateValid && !!cor && !!arv;
  }, [arv, cor, corDate, propertyValue, purchasePrice]);

  const handledSubmit = useCallback(async () => {
    const dateValid = isValid(corDate) && isDate(corDate);

    setSaveLoading(true);
    const postData = {
      taskId: router.query.taskId as string,
      taskForm: {
        cor,
        corDate: dateValid
          ? format(corDate as Date, 'yyyy-MM-dd O')
          : undefined,
        purchasePrice,
        propertyValue,
        arv,
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
    arv,
    cor,
    corDate,
    enqueueSnackbar,
    propertyValue,
    purchasePrice,
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
              'Below are all of the details we have about your deal. If you have to change these details, you may do so below. Please note that changes may affect your LTV (loan to value) or your rate.'
            }
            tipSx={{ mb: 0 }}
            width={'100%'}
          >
            <StyledFormItem
              label={'Purchase price'}
              sub
              tip={'The price you paid or are paying for the subject property.'}
            >
              <Stack maxWidth={600} width={'100%'}>
                <StyledTextFieldNumber
                  label={'Purchase price'}
                  onValueChange={({ floatValue }) => {
                    setPurchasePrice(floatValue);
                  }}
                  prefix={'$'}
                  value={purchasePrice}
                />
              </Stack>
            </StyledFormItem>

            <StyledFormItem
              label={'As-is property value'}
              sub
              tip={
                'Your estimate of the current value of the property (before any rehabilitation).'
              }
            >
              <Stack maxWidth={600} width={'100%'}>
                <StyledTextFieldNumber
                  label={'As-is property value'}
                  onValueChange={({ floatValue }) => {
                    setPropertyValue(floatValue);
                  }}
                  prefix={'$'}
                  value={propertyValue}
                />
              </Stack>
            </StyledFormItem>

            <StyledFormItem
              label={'Estimated rehab loan amount'}
              sub
              tip={`Total cost that you would like ${
                //sass
                saasState?.organizationName || 'YouLand'
              } to finance.`}
            >
              <Stack maxWidth={600} width={'100%'}>
                <StyledTextFieldNumber
                  label={'Estimated rehab loan amount'}
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
                Confirm
              </StyledButton>
            </Stack>
          </StyledFormItem>
        )}
      </Transitions>
    </>
  );
};
