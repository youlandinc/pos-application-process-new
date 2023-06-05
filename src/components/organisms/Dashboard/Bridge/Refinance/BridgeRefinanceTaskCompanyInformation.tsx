import { FC, useState } from 'react';

import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import { observer } from 'mobx-react-lite';

import { Stack } from '@mui/material';
import {
  StyledButton,
  StyledButtonGroup,
  StyledDatePicker,
  StyledFormItem,
  StyledGoogleAutoComplete,
  StyledSelectOption,
  StyledTextField,
  StyledTextFieldPhone,
  Transitions,
} from '@/components/atoms';

import { Address, IAddress } from '@/models/common/Address';
import {
  OPTIONS_COMMON_YES_OR_NO,
  OPTIONS_TASK_BEHALF_TYPE,
  OPTIONS_TASK_MANAGING_LOAN_CLOSING,
} from '@/constants';

export const BridgeRefinanceTaskCompanyInformation: FC = observer(() => {
  // const {

  // } = useMst();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [titleOrderNumber, settitleOrderNumber] = useState('');
  const [date, setDate] = useState<string | Date>('');
  const [instructions, setInstructions] = useState<string | number>('');
  const [loanClosing, setLoanClosing] = useState(true);
  const [escrowNumber, setEscrowNumber] = useState('');
  const [whoIsManaging, steWhoIsManaging] = useState<string | number>('');
  const [address, setAddress] = useState<IAddress>(
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

  return (
    <StyledFormItem
      gap={6}
      label={'Closing Agent / Title Company Information'}
      tip={
        'A closing agent assists with closing and verifies there are no outstanding title issues. YouLand also orders a Title Commitment and a Title Report on the property from this agent.'
      }
      tipSx={{ mb: 0 }}
    >
      <StyledFormItem
        gap={3}
        label={'Provide contact details'}
        labelSx={{ mb: 0 }}
        maxWidth={600}
        sub
      >
        <Stack
          flexDirection={{ lg: 'row', xs: 'column' }}
          gap={3}
          width={'100%'}
        >
          <StyledTextField label={'Contact First Name'} value={firstName} />
          <StyledTextField label={'Contact Last Name'} value={lastName} />
        </Stack>

        <Stack gap={3} width={'100%'}>
          <StyledTextFieldPhone
            label={'Phone Number'}
            onValueChange={({ value }) => setPhoneNumber(value)}
            value={phoneNumber}
          />
          <StyledTextField label={'Email'} value={email} />
        </Stack>
        <Stack
          flexDirection={{ lg: 'row', xs: 'column' }}
          gap={3}
          width={'100%'}
        >
          <StyledTextField label={'Company Name'} value={companyName} />
          <StyledTextField
            label={'Title Order Number'}
            value={titleOrderNumber}
          />
        </Stack>
        <Stack width={'100%'}>
          <StyledDatePicker
            label={'MM/DD/YYYY'}
            onChange={(date) => setDate(date as string | Date)}
            value={date}
          />
        </Stack>
        <Stack width={'100%'}>
          <StyledGoogleAutoComplete address={address} />
        </Stack>
      </StyledFormItem>

      <StyledFormItem
        label={
          'Who is signing the closing instructions on behalf of the title company?'
        }
      >
        <Stack maxWidth={600} width={'100%'}>
          <StyledSelectOption
            onChange={(value) => setInstructions(value)}
            options={OPTIONS_TASK_BEHALF_TYPE}
            value={instructions}
          />
        </Stack>
      </StyledFormItem>

      <StyledFormItem
        label={'Is the title company also managing loan closing?'}
        maxWidth={600}
        sub
      >
        <StyledButtonGroup
          onChange={(e, value) => {
            if (value !== null) {
              setLoanClosing(value === 'yes');
            }
          }}
          options={OPTIONS_COMMON_YES_OR_NO}
          sx={{ width: '100%', maxWidth: 600 }}
          value={loanClosing}
        />
      </StyledFormItem>
      <Stack justifyContent={'center'} maxWidth={600} width={'100%'}>
        <Transitions style={{ width: '100%' }}>
          {loanClosing ? (
            <Stack width={'100%'}>
              <StyledTextField label={'Escrow Number'} value={escrowNumber} />
            </Stack>
          ) : (
            <StyledFormItem
              gap={3}
              label={'Who is managing loan closing?'}
              labelSx={{ mb: 0 }}
              sub
            >
              <Stack maxWidth={600} width={'100%'}>
                <StyledSelectOption
                  onChange={(value) => steWhoIsManaging(value)}
                  options={OPTIONS_TASK_MANAGING_LOAN_CLOSING}
                  value={whoIsManaging}
                />
              </Stack>
              <Stack
                flexDirection={{ lg: 'row', xs: 'column' }}
                gap={3}
                mt={3}
                width={'100%'}
              >
                <StyledTextField
                  label={'Contact First Name'}
                  value={firstName}
                />
                <StyledTextField label={'Contact Last Name'} value={lastName} />
              </Stack>

              <Stack
                flexDirection={{ lg: 'row', xs: 'column' }}
                gap={3}
                width={'100%'}
              >
                <StyledTextFieldPhone
                  label={'Phone Number'}
                  onValueChange={({ value }) => setPhoneNumber(value)}
                  value={phoneNumber}
                />
                <StyledTextField label={'Email'} value={email} />
              </Stack>
              <Stack
                flexDirection={{ lg: 'row', xs: 'column' }}
                gap={3}
                width={'100%'}
              >
                <StyledTextField label={'Company Name'} value={companyName} />
                <StyledTextField
                  label={'Title Order Number'}
                  value={titleOrderNumber}
                />
              </Stack>
              <Stack width={'100%'}>
                <StyledDatePicker
                  label={'MM/DD/YYYY'}
                  onChange={(date) => setDate(date as string | Date)}
                  value={date}
                />
              </Stack>
              <Stack width={'100%'}>
                <StyledGoogleAutoComplete address={address} />
              </Stack>
            </StyledFormItem>
          )}
        </Transitions>
      </Stack>

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
        <StyledButton sx={{ flex: 1 }}>Save</StyledButton>
      </Stack>
    </StyledFormItem>
  );
});
