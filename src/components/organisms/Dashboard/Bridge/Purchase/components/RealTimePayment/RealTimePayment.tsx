import { Stack, Typography } from '@mui/material';
import { FC, FormEvent, useState } from 'react';
import Image from 'next/image';
import { enqueueSnackbar } from 'notistack';
import useAsyncFn from 'react-use/lib/useAsyncFn';

import { _createAchPayment } from '@/requests/dashboard/task';

import {
  DefaultParamType,
  SignatureDialog,
} from '@/components/organisms/Dashboard/Bridge';

import { useSwitch } from '@/hooks';
import {
  StyledButton,
  StyledTextField,
  StyledTextFieldNumber,
} from '@/components/atoms';

import {
  BizTypeEnum,
  PaymentLoanSource,
  PaymentMethodEnum,
} from '@/types/enum';

type DebtorInfoType = {
  routing_number: string;
  bank_account_number: string;
};

type CreditorInfoType = {
  name: string;
  street_name: string;
  street_number: string;
  postal_code: string;
  city: string;
  state: string;
  country: string;
  bank_account_number: string;
  routing_number: string;
};

type RemittanceInfoType = {
  remittance_information_unstructured: string;
};

type BizRequestInfoType = {
  bizType: BizTypeEnum.WELLS_FARGO_RTP;
  amount: string;
  currency: string;
  debtor: DebtorInfoType;
  creditor: CreditorInfoType;
  remittance: RemittanceInfoType;
};

type RealTimePaymentParam = DefaultParamType & {
  bizRequest: BizRequestInfoType;
};
//payer
const creditor = {
  name: 'John Doe',
  street_name: 'S TRYON ST',
  street_number: '301',
  postal_code: '28282',
  city: 'CHARLOTTE',
  state: 'NC',
  country: 'US',
  bank_account_number: '123',
  routing_number: '121000248',
};

//payee
const defaultDebtor = {
  routing_number: '122199983',
  bank_account_number: '61231234325',
};

export const RealTimePayment: FC = (props) => {
  const { visible, open, close } = useSwitch();

  const [previewUrl, setPreviewUrl] = useState('');

  const [cardInfo, setCardInfo] = useState({
    routing_number: '', //输入框
    bank_account_number: '', //输入框
    street_name: 'S TRYON ST',
    street_number: '301',
    postal_code: '28282',
    city: 'CHARLOTTE',
    state: 'NC',
    country: 'US',
  });

  const [note, setNode] = useState('');

  const handleSave = (url: string) => {
    setPreviewUrl(url);
    close();
  };

  const [state, createPayment] = useAsyncFn(async () => {
    e.preventDefault();
    if (validateNoteLength) {
      return;
    }
    const defaultValues: RealTimePaymentParam = {
      feeType: 'Appraisal',
      loanId: 611,
      paymentMethod: PaymentMethodEnum.WELLS_FARGO_RTP,
      source: PaymentLoanSource.LOS,
      bizRequest: {
        bizType: BizTypeEnum.WELLS_FARGO_RTP,
        amount: '100',
        currency: 'USD',
        debtor: defaultDebtor,
        creditor: { ...cardInfo, name: 'John Doe' }, //payee
        remittance: {
          remittance_information_unstructured: note,
        },
      },
    };
    await _createAchPayment(defaultValues).then((res) => {
      enqueueSnackbar('Paid successfully', {
        variant: 'success',
      });
    });
  }, [cardInfo, note]);

  const validateNoteLength = note.trim().length > 100;

  return (
    <Stack
      autoComplete={'off'}
      component={'form'}
      onSubmit={(e) => {
        e.preventDefault();
        createPayment();
      }}
      spacing={1.5}
    >
      <Stack
        border={'1px solid'}
        borderColor={'background.border_default'}
        borderRadius={2}
        p={3}
        spacing={3}
      >
        <Typography variant={'h6'}>Enter bank information</Typography>
        <Stack direction={'row'} justifyContent={'space-between'} spacing={3}>
          <StyledTextFieldNumber
            decimalScale={0}
            label={'Routing Number'}
            onValueChange={({ value }) => {
              setCardInfo({
                ...cardInfo,
                routing_number: value,
              });
            }}
            prefix={' '}
            required
            thousandSeparator={false}
            value={cardInfo.routing_number}
          />
          <StyledTextFieldNumber
            decimalScale={0}
            label={'Bank Account Number'}
            onValueChange={({ value }) => {
              setCardInfo({
                ...cardInfo,
                bank_account_number: value,
              });
            }}
            prefix={' '}
            required
            thousandSeparator={false}
            value={cardInfo.bank_account_number}
          />
        </Stack>
      </Stack>
      <Stack
        border={'1px solid'}
        borderColor={'background.border_default'}
        borderRadius={2}
        p={3}
        spacing={3}
      >
        <Typography variant={'h6'}>Additional Information</Typography>
        <Stack spacing={1}>
          <StyledTextField
            label={'Note'}
            maxRows={3}
            multiline
            onChange={(e) => {
              setNode(e.target.value);
            }}
            sx={{ width: '100% !important' }}
            validate={
              validateNoteLength
                ? ['Must be less than 100 characters']
                : undefined
            }
            value={note}
          />
          <Typography color={'info.main'} variant={'body3'}>
            Maximum 100 characters (optional)
          </Typography>
        </Stack>
      </Stack>
      <Stack
        border={'1px solid'}
        borderColor={'background.border_default'}
        borderRadius={2}
        p={3}
      >
        <Stack direction={'row'} spacing={3}>
          <Stack spacing={1.5}>
            <Typography variant={'body3'}>
              By proceeding with this express payment, you confirm and ensure
              the following:
            </Typography>
            <Stack
              component={'ul'}
              pl={1}
              sx={{ listStyle: 'decimal', listStylePosition: 'inside' }}
            >
              <Typography component={'li'} variant={'body3'}>
                The Bank Account information provided for this transaction is
                accurate and truthful.
              </Typography>
              <Typography component={'li'} variant={'body3'}>
                You have authorization as a signatory on the Bank Account.
              </Typography>
              <Typography component={'li'} variant={'body3'}>
                {
                  'You grant authorization to YouLand to initiate a one-time payment, either by check or electronic debit, amounting to {$675.00}.'
                }
              </Typography>
            </Stack>
            <Typography variant={'body3'}>
              Please be aware that the funds may be debited from your Bank
              Account as early as today.
            </Typography>
            <Typography variant={'body3'}>
              In the event of a failed ACH transfer for any reason, you
              acknowledge your responsibility to ensure timely payment according
              to the agreement. It is mutually understood and agreed that
              YouLand holds no liability for any damages or losses arising from
              ACH transfer failures.
            </Typography>
          </Stack>
          <Stack
            flexShrink={0}
            justifyContent={'space-between'}
            textAlign={'center'}
            width={240}
          >
            <Typography fontWeight={600} variant={'body3'}>
              Sign below to approve payment
            </Typography>
            <StyledButton
              fullWidth
              onClick={open}
              sx={{
                height: 120,
                bgcolor: 'rgba(17, 52, 227, 0.10)',
                fontSize: 12,
                borderRadius: 2,
                border: '2px dashed',
                borderColor: 'text.menu_selected',
                color: 'text.menu_selected',
                '&:hover': {
                  bgcolor: 'rgba(75,107,182,0.2) !important',
                },
              }}
            >
              {previewUrl ? (
                <Image
                  alt={'Signature'}
                  height={120}
                  src={previewUrl}
                  width={240}
                />
              ) : (
                'Click to sign'
              )}
            </StyledButton>
            <StyledButton
              loading={state.loading}
              size={'large'}
              type={'submit'}
              variant={'contained'}
            >
              Pay now
            </StyledButton>
          </Stack>
        </Stack>
      </Stack>
      <SignatureDialog
        onClose={close}
        onSave={handleSave}
        open={visible}
        title={'Please add your signature'}
      />
    </Stack>
  );
};
