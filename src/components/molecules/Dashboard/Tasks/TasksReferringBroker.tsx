import { FC, useMemo, useState } from 'react';
import { Fade, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';

import { observer } from 'mobx-react-lite';

import { OPTIONS_COMMON_YES_OR_NO } from '@/constants';

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

import { LoanAnswerEnum } from '@/types';
import { Address, IAddress } from '@/models/common/Address';

export const TasksReferringBroker: FC = observer(() => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const [isReferringBroker, setIsReferringBroker] = useState<boolean>(false);
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [brokerLicense, setBrokerLicense] = useState<string>('');
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

  const isFormDataValid = useMemo(() => {
    return true;
  }, []);

  const handleSave = async () => {
    console.log(123);
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
              setIsReferringBroker(value === LoanAnswerEnum.yes);
            }}
            options={OPTIONS_COMMON_YES_OR_NO}
            value={isReferringBroker ? LoanAnswerEnum.yes : LoanAnswerEnum.no}
          />
        </StyledFormItem>

        <Transitions
          style={{
            display: isReferringBroker ? 'block' : 'none',
            width: '100%',
          }}
        >
          {isReferringBroker && (
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
                  address={address}
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
