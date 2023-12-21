import { FC, useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { Stack } from '@mui/material';
import { useAsync } from 'react-use';
import { useSnackbar } from 'notistack';

import { observer } from 'mobx-react-lite';

import { _fetchTaskFormInfo, _updateTaskFormInfo } from '@/requests/dashboard';
import {
  AUTO_HIDE_DURATION,
  OPTIONS_MORTGAGE_PROPERTY,
  OPTIONS_MORTGAGE_UNIT,
} from '@/constants';
import { Address, IAddress } from '@/models/common/Address';
import { HttpError, PropertyOpt, PropertyUnitOpt } from '@/types';

import {
  StyledButton,
  StyledFormItem,
  StyledGoogleAutoComplete,
  StyledLoading,
  StyledSelectOption,
  Transitions,
} from '@/components/atoms';

export const FixPurchaseTaskPropertyDetails: FC = observer(() => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [address] = useState<IAddress>(
    Address.create({
      formatAddress: '',
      state: '',
      street: '',
      city: '',
      aptNumber: '',
      postcode: '',
      isValid: false,
      errors: {},
    }),
  );

  const [saveLoading, setSaveLoading] = useState<boolean>(false);

  const [propertyType, setPropertyType] = useState<PropertyOpt | undefined>();
  const [propertyUnit, setPropertyUnit] = useState<
    PropertyUnitOpt | undefined
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
        const { propAddr, propertyType, propertyUnit } = res.data;
        setPropertyType(propertyType || undefined);
        setPropertyUnit(propertyUnit || undefined);
        setTimeout(() => {
          address.injectServerData({
            formatAddress: '',
            state: '',
            street: '',
            city: '',
            aptNumber: '',
            postcode: '',
            ...propAddr,
          });
        });
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
    return propertyType === PropertyOpt.twoToFourFamily
      ? address.checkAddressValid && !!propertyUnit
      : !!propertyType && address.checkAddressValid;
  }, [address.checkAddressValid, propertyType, propertyUnit]);

  const handledSubmit = useCallback(async () => {
    setSaveLoading(true);
    const postData = {
      taskId: router.query.taskId as string,
      taskForm: {
        propAddr: address.getPostData(),
        propertyType,
        propertyUnit,
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
  }, [address, enqueueSnackbar, propertyType, propertyUnit, router]);

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
            label={'Property details'}
            maxWidth={900}
            mx={{ lg: 'auto', xs: 0 }}
            px={{ lg: 3, xs: 0 }}
            tip={
              'To revise the address on this loan application please reach out to your account manager.'
            }
            tipSx={{ mb: 0 }}
            width={'100%'}
          >
            <StyledFormItem
              label={'Property address'}
              sub
              tip={
                'The price you paid or are paying for the property that the loan is for.'
              }
            >
              <Stack maxWidth={600} width={'100%'}>
                <StyledGoogleAutoComplete address={address} disabled />
              </Stack>
            </StyledFormItem>

            <StyledFormItem label={'What is the property type?'} sub>
              <Stack maxWidth={600} width={'100%'}>
                <StyledSelectOption
                  onChange={(value) => {
                    setPropertyType(value as PropertyOpt);
                  }}
                  options={OPTIONS_MORTGAGE_PROPERTY}
                  value={propertyType}
                />
              </Stack>
            </StyledFormItem>

            <Transitions
              style={{
                display:
                  propertyType === PropertyOpt.twoToFourFamily
                    ? 'block'
                    : 'none',
                width: '100%',
              }}
            >
              {propertyType === PropertyOpt.twoToFourFamily && (
                <StyledFormItem
                  label={'How many units will the property have?'}
                  sub
                >
                  <Stack maxWidth={600} width={'100%'}>
                    <StyledSelectOption
                      onChange={(value) => {
                        setPropertyUnit(value as PropertyUnitOpt);
                      }}
                      options={OPTIONS_MORTGAGE_UNIT}
                      value={propertyUnit}
                    />
                  </Stack>
                </StyledFormItem>
              )}
            </Transitions>

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
});
