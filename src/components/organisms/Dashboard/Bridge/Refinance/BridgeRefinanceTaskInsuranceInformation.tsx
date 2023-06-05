import { FC, useState } from 'react';

import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';

import {
  StyledButton,
  StyledFormItem,
  StyledGoogleAutoComplete,
  StyledTextField,
  StyledTextFieldPhone,
} from '@/components/atoms';
import { Stack } from '@mui/material';

import { Address, IAddress } from '@/models/common/Address';

export const BridgeRefinanceTaskInsuranceInformation: FC = observer(() => {
  // const {

  // } = useMst();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const [agentName, setAgentName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
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
          <StyledTextField label={'Company Name'} value={companyName} />
          <StyledTextField label={'Agent Name'} value={agentName} />
        </Stack>

        <Stack gap={3} width={'100%'}>
          <StyledTextFieldPhone
            label={'Phone Number'}
            onValueChange={({ value }) => setPhoneNumber(value)}
            value={phoneNumber}
          />
          <StyledTextField label={'Email'} value={email} />
        </Stack>

        <Stack width={'100%'}>
          <StyledGoogleAutoComplete address={address} />
        </Stack>
      </StyledFormItem>

      {/* <StyledFormItem
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
         </StyledFormItem> */}

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
