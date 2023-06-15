import { FC, useRef, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { CloseOutlined } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';

import { observer } from 'mobx-react-lite';

import { Address, IAddress } from '@/models/common/Address';
import {
  OPTIONS_ACCOUNT_TYPE,
  OPTIONS_TASK_AUTOMATIC_PAYMENT,
} from '@/constants';
import { useRenderPdf, useSwitch } from '@/hooks';

import {
  StyledButton,
  StyledDialog,
  StyledFormItem,
  StyledGoogleAutoComplete,
  StyledSelect,
  StyledSelectOption,
  StyledTextField,
  Transitions,
} from '@/components/atoms';

export const BridgePurchaseTaskPay: FC = observer(() => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const { visible, open, close } = useSwitch(false);

  const [bankName, setBankName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountType, setAccountType] = useState('');

  const [genLoading, setGenLoading] = useState<boolean>(false);
  const [agreeLoading, setAgreeLoading] = useState<boolean>(false);

  const pdfFile = useRef(null);
  const { renderFile } = useRenderPdf(pdfFile);

  const [paymentType, setPaymentType] = useState<string | number>('ACH_debit');
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
    <StyledFormItem gap={3} label={'Set Up Auto Pay'} tipSx={{ mb: 0 }}>
      <StyledFormItem
        label={'Which type of automatic payment would you like to use?'}
      >
        <Stack maxWidth={600} width={'100%'}>
          <StyledSelectOption
            onChange={(value) => setPaymentType(value)}
            options={OPTIONS_TASK_AUTOMATIC_PAYMENT}
            value={paymentType}
          />
        </Stack>
      </StyledFormItem>
      <Stack justifyContent={'center'} maxWidth={900} mt={3} width={'100%'}>
        <Transitions style={{ width: '100%' }}>
          {paymentType === 'ACH_debit' ? (
            <StyledFormItem
              gap={3}
              label={'Manually Enter Information'}
              maxWidth={900}
              sub
              tip={
                "We have partnered with Chase Bank to utilize their auto payment functionality. Through this approach, we can automatically withdraw funds from the customer's account to complete the monthly payments. Throughout this process, we will adhere to Chase Bank's security protocols to ensure that our customer's information is fully protected. If you need more information, please contact us."
              }
            >
              <StyledFormItem
                gap={3}
                label={'ACH Information'}
                labelSx={{ mb: 0 }}
                maxWidth={600}
                sub
              >
                <Stack width={'100%'}>
                  <StyledTextField label={'Bank Name'} value={bankName} />
                </Stack>
                <Stack width={'100%'}>
                  <StyledGoogleAutoComplete
                    address={address}
                    label={'Bank Address'}
                  />
                </Stack>
                <Stack
                  flexDirection={{ lg: 'row', xs: 'column' }}
                  gap={3}
                  width={'100%'}
                >
                  <StyledTextField
                    label={'Account Holder Name'}
                    value={accountName}
                  />
                  <StyledTextField
                    label={'Routing number'}
                    value={routingNumber}
                  />
                </Stack>

                <Stack
                  flexDirection={{ lg: 'row', xs: 'column' }}
                  gap={3}
                  width={'100%'}
                >
                  <StyledTextField
                    label={'Account Number'}
                    value={accountNumber}
                  />
                  <StyledSelect
                    label={'Account Type'}
                    onChange={(e) => setAccountType(e.target.value as string)}
                    options={OPTIONS_ACCOUNT_TYPE}
                    value={accountType}
                  />
                </Stack>
                <Stack gap={3} width={'100%'}>
                  <StyledButton
                    loading={genLoading}
                    loadingText={'Generating...'}
                    sx={{
                      width: { lg: 600, xs: '100%' },
                      mt: { xs: 0, lg: 3 },
                    }}
                    variant={'outlined'}
                  >
                    Generate File
                  </StyledButton>
                </Stack>
              </StyledFormItem>
              <Typography
                component={'div'}
                mt={3}
                textAlign={'center'}
                variant={'body1'}
              >
                The attached document is the{' '}
                <Typography
                  className={'link_style'}
                  component={'span'}
                  fontWeight={600}
                  // onClick={() =>
                  //   window.open(computedAch.ach.taskForm.documentFile.url)
                  // }
                >
                  ACH Information.pdf
                </Typography>{' '}
                that you have confirmed. In case you need to make any changes, a
                new agreement will be generated and require your agreement
                again.
              </Typography>
            </StyledFormItem>
          ) : (
            <StyledFormItem
              label={'Verify your account using Plaid'}
              sub
              tip={
                'Once directed to your financial institution, please authorize Plaid to access account information for the account you would like to link. If access is not granted, we will be unable to verify bank account ownership.'
              }
            >
              <Stack maxWidth={600} mt={3} width={'100%'}>
                <StyledButton color={'primary'} variant={'outlined'}>
                  Link Account
                </StyledButton>
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

      <StyledDialog
        content={<Box ref={pdfFile} />}
        disableEscapeKeyDown
        footer={
          <Stack
            flexDirection={{ xs: 'column', lg: 'row' }}
            gap={3}
            justifyContent={{ lg: 'space-between', xs: 'center' }}
            pb={3}
            textAlign={'left'}
            width={'100%'}
          >
            <Typography variant={'body1'}>
              &quot;By clicking the below button, I hereby agree to the above
              broker agreement.&quot;
            </Typography>
            <StyledButton
              disabled={agreeLoading}
              loading={agreeLoading}
              loadingText={'Processing...'}
              // onClick={handledSaveFile}
            >
              I Agree
            </StyledButton>
          </Stack>
        }
        header={
          <Stack
            alignItems={'center'}
            flexDirection={'row'}
            justifyContent={'space-between'}
            pb={3}
          >
            <Typography variant={'h6'}>ACH Information</Typography>
            <StyledButton disabled={agreeLoading} isIconButton onClick={close}>
              <CloseOutlined />
            </StyledButton>
          </Stack>
        }
        open={visible}
        sx={{
          '& .MuiPaper-root': {
            maxWidth: { lg: '900px !important', xs: '100% !important' },
            width: '100%',
            '& .MuiDialogTitle-root, & .MuiDialogActions-root': {
              bgcolor: '#F5F8FA',
              p: 3,
            },
          },
        }}
      />
    </StyledFormItem>
  );
});
