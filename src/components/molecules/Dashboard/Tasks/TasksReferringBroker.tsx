import { FC, useMemo, useState } from 'react';
import { Fade, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';

import { observer } from 'mobx-react-lite';

import { AUTO_HIDE_DURATION, OPTIONS_COMMON_YES_OR_NO } from '@/constants';

import {
  StyledButton,
  StyledButtonGroup,
  StyledFormItem,
  StyledGoogleAutoComplete,
  StyledLoading,
  StyledTextField,
  StyledTextFieldPhone,
  Transitions,
} from '@/components/atoms';

import { DashboardTaskKey, HttpError, LoanAnswerEnum } from '@/types';
import { Address, IAddress } from '@/models/common/Address';
import { useAsync } from 'react-use';
import { POSGetParamsFromUrl } from '@/utils';
import {
  _fetchLoanTaskDetail,
  _updateLoanTaskDetail,
} from '@/requests/dashboard';
import { useSnackbar } from 'notistack';

export const TasksReferringBroker: FC = observer(() => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [saveLoading, setSaveLoading] = useState(false);

  const [hasReferringBroker, setHasReferringBroker] = useState<boolean>(false);

  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [brokerLicense, setBrokerLicense] = useState<string>('');

  const [mailingAddress] = useState<IAddress>(
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

  const { loading } = useAsync(async () => {
    const { loanId } = POSGetParamsFromUrl(location.href);
    if (!loanId) {
      return;
    }
    try {
      const {
        data: {
          data: {
            email,
            firstName,
            lastName,
            phoneNumber,
            brokerLicense,
            address,
            hasReferringBroker,
          },
        },
      } = await _fetchLoanTaskDetail({
        loanId,
        taskKey: DashboardTaskKey.referring_broker,
      });

      setHasReferringBroker(hasReferringBroker ?? false);

      setEmail(email ?? '');
      setFirstName(firstName ?? '');
      setLastName(lastName ?? '');
      setPhoneNumber(phoneNumber ?? '');
      setBrokerLicense(brokerLicense ?? '');

      address && mailingAddress.injectServerData(address);
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
    if (!hasReferringBroker) {
      return true;
    }
    return (
      !!email &&
      !!firstName &&
      !!lastName &&
      !!phoneNumber &&
      mailingAddress.isValid
    );
  }, [
    email,
    firstName,
    hasReferringBroker,
    lastName,
    mailingAddress.isValid,
    phoneNumber,
  ]);

  const handleSave = async () => {
    const postData = {
      loanId: POSGetParamsFromUrl(location.href).loanId,
      taskKey: DashboardTaskKey.referring_broker,
      data: {
        email,
        firstName,
        lastName,
        phoneNumber,
        brokerLicense,
        address: mailingAddress.getPostData(),
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
          Referring broker
          <Typography
            color={'text.secondary'}
            fontSize={{ xs: 12, lg: 16 }}
            variant={'body1'}
          >
            If applicable, please provide the details of the referring broker.
            This will be used for the loan documents.
          </Typography>
        </Typography>

        <StyledFormItem label={'Is there a referring broker?'} sub>
          <StyledButtonGroup
            onChange={(e, value) => {
              if (value === null) {
                return;
              }
              setHasReferringBroker(value === LoanAnswerEnum.yes);
            }}
            options={OPTIONS_COMMON_YES_OR_NO}
            value={hasReferringBroker ? LoanAnswerEnum.yes : LoanAnswerEnum.no}
          />
        </StyledFormItem>

        <Transitions
          style={{
            display: hasReferringBroker ? 'block' : 'none',
            width: '100%',
          }}
        >
          {hasReferringBroker && (
            <Stack gap={6} width={'100%'}>
              <StyledFormItem gap={3} label={'Personal information'} sub>
                <Stack flexDirection={{ xs: 'column', lg: 'row' }} gap={3}>
                  <StyledTextField
                    label={'First name'}
                    onChange={(e) => {
                      const value = (e.target.value as string)?.replace(
                        /^./,
                        (match) => match?.toUpperCase(),
                      );
                      setFirstName(value);
                    }}
                    placeholder={'First name'}
                    required
                    value={firstName}
                  />
                  <StyledTextField
                    label={'Last name'}
                    onChange={(e) => {
                      const value = (e.target.value as string)?.replace(
                        /^./,
                        (match) => match.toUpperCase(),
                      );
                      setLastName(value);
                    }}
                    placeholder={'Last name'}
                    required
                    value={lastName}
                  />
                </Stack>

                <Stack flexDirection={{ xs: 'column', lg: 'row' }} gap={3}>
                  <StyledTextField
                    label={'Email'}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={'Email'}
                    required
                    value={email}
                  />
                  <StyledTextFieldPhone
                    label={'Phone number'}
                    onValueChange={({ value }) => setPhoneNumber(value)}
                    placeholder={'Phone number'}
                    required
                    value={phoneNumber}
                  />
                </Stack>

                <StyledTextField
                  label={'Broker license (optional)'}
                  onChange={(e) => setBrokerLicense(e.target.value)}
                  placeholder={'Broker license (optional)'}
                  value={brokerLicense}
                />
              </StyledFormItem>

              <StyledFormItem label={'Mailing information (optional)'} sub>
                <StyledGoogleAutoComplete
                  address={mailingAddress}
                  label={'Mailing address'}
                />
              </StyledFormItem>
            </Stack>
          )}
        </Transitions>

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
    </Fade>
  );
});
