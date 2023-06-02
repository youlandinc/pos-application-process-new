import { FC, useState } from 'react';

import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import { observer } from 'mobx-react-lite';

// import { BridgePurchasePaymentSummary, PaymentTask } from '@/components/molecules';

import { Stack } from '@mui/material';
import {
  StyledButton,
  StyledDatePicker,
  StyledFormItem,
  StyledGoogleAutoComplete,
  StyledTextField,
  StyledTextFieldPhone,
  StyledUploadBox,
} from '@/components/atoms';

import { Address, IAddress } from '@/models/common/Address';

export const BridgePurchaseTaskInsuranceInformation: FC = observer(() => {
  // const {

  // } = useMst();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [titleOrderNumber, settitleOrderNumber] = useState('');
  const [date, setDate] = useState<string | Date>('');
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
      label={'Homeowner Insurance Provider Information'}
      tip={
        'Homeowner insurance must comply with our Policy Guidelines and it is required to close your loan. Once you are covered, provide your insurance provider’s contact information. This allows us to speak directly with your provider on the details and get confirmation that your home is insured.'
      }
      tipSx={{ mb: 0 }}
    >
      <StyledFormItem
        gap={3}
        label={'Insurance provider information'}
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

        <Stack
          flexDirection={{ lg: 'row', xs: 'column' }}
          gap={3}
          width={'100%'}
        >
          <StyledTextFieldPhone
            label={'Phone Number'}
            onValueChange={({ value }) => setPhone(value)}
            value={phone}
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
        label={'Upload your evidence of insurance'}
        maxWidth={900}
        sub
      >
        <StyledUploadBox
          fileList={[]}
          onDelete={() => {
            console.log('onDelete');
          }}
          onSuccess={() => {
            console.log('onSuccess');
          }}
        />
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
          onClick={() => router.push('/dashboard/tasks')}
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
