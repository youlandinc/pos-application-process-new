import {AUTO_HIDE_DURATION} from '@/constants';
import {HttpError} from '@/types';
import { FC, FormEvent, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import Image from 'next/image';
import useAsyncFn from 'react-use/lib/useAsyncFn';
import { enqueueSnackbar } from 'notistack';

import { SignatureDialog } from '@/components/organisms/Dashboard/Bridge';
import {
  StyledButton,
  StyledRadioWithLabel,
  StyledSelect,
  StyledTextField,
  StyledTextFieldNumber,
} from '@/components/atoms';
import { useSwitch } from '@/hooks';

import { _createAchPayment } from '@/requests/dashboard/task';

import { ACH_ACCOUNT_TYPE, ACH_Routing_Number_Type } from '@/constants/options';

import {
  BizTypeEnum,
  PaymentLoanSource,
  PaymentMethodEnum,
} from '@/types/enum';

type BinkInfoType = {
  account_number: string;
  account_type: string;
  routing_number: string;
  routing_number_type: string;
};

export type DefaultParamType = {
  feeType: string;
  paymentMethod: PaymentMethodEnum;
  loanId: number;
  source: PaymentLoanSource;
};

type DirectDebitPaymentInfo = {
  amount: string; //从接口取
  currency: string; //固定值
};

type DirectDebitDebtorInfo = {
  name: string; //borrower name  接口取
  bank_account: BinkInfoType;
};

type DirectDebitInfo = {
  payment: DirectDebitPaymentInfo;
  debtor: DirectDebitDebtorInfo;
  remittance_information: {
    unstructured_addenda: string[]; //['test for sandbox'], //备注
  };
};

type BizRequestInfoType = {
  bizType: BizTypeEnum;
  // requested_execution_date: string; //测试用这个，测试完可以不传
  direct_debit: DirectDebitInfo;
  creditor:{
    name:string;
  },
};

export type AchPaymentParam = DefaultParamType & {
  bizRequest: BizRequestInfoType;
};

const defaultParam: DefaultParamType = {
  feeType: 'Appraisal',
  paymentMethod: PaymentMethodEnum.WELLS_FARGO,
  loanId: 1804,
  source: PaymentLoanSource.LOS,
};

const defaultBizType = BizTypeEnum.WELLS_FARGO_ACH;
const defaultCurrency = 'USD'; //固定值
const defaultRoutingNumberType = 'USABA'; //固定值

export const AchPaymentCard: FC = (props) => {
  const { visible, open, close } = useSwitch();

  const [cardInfo, setCardInfo] = useState({
    account_number: '', //输入框
    routing_number: '', //输入框
    account_type: 'SAVINGS', //输入框
    routing_number_type: defaultRoutingNumberType,
  });

  const [note, setNode] = useState('');

  const [previewUrl, setPreviewUrl] = useState('');

  const handleSave = (url: string) => {
    setPreviewUrl(url);
    close();
  };

  const [state, createPayment] = useAsyncFn(async () => {
    // e.preventDefault();
    if (validateNoteLength) {
      return;
    }
    const param: AchPaymentParam = {
      ...defaultParam,
      bizRequest: {
        bizType: defaultBizType,
        'creditor':{
          'name':'Creditor Company'
        },
        direct_debit: {
          payment: {
            amount: '155.96', //从接口取
            currency: defaultCurrency, //固定值
          },
          debtor: {
            name: 'Joe Debtor', //borrower name  接口取
            bank_account: cardInfo,
          },
          remittance_information: {
            unstructured_addenda: [note], //备注，后端接收是['xxx']的形式
          },
        },
      },
    };
    await _createAchPayment(param).then((res) => {
      enqueueSnackbar('Paid successfully', {
        variant: 'success',
      });
    }).catch((err)=>{
        const { header, message, variant } = err as HttpError;
        enqueueSnackbar(message, {
          variant: variant || 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
          isSimple: !header,
          header,
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
        <Stack
          direction={'row'}
          flexWrap={'wrap'}
          gap={3}
          sx={{
            '& .MuiFormControl-root': {
              width: 'calc(50% - 12px)',
            },
          }}
        >
          <StyledTextFieldNumber
            decimalScale={0}
            label={'Account Number'}
            onValueChange={({ value }) => {
              setCardInfo({
                ...cardInfo,
                account_number: value,
              });
            }}
            prefix={' '}
            required
            thousandSeparator={false}
            value={cardInfo.account_number}
          />

          <StyledSelect
            label={'Account type'}
            onChange={(e) => {
              setCardInfo({
                ...cardInfo,
                account_type: e.target.value as unknown as string,
              });
            }}
            options={ACH_ACCOUNT_TYPE}
            value={cardInfo.account_type}
          />

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

          <StyledSelect
            label={'Routing number type'}
            onChange={(e) => {
              setCardInfo({
                ...cardInfo,
                routing_number_type: e.target.value as unknown as string,
              });
            }}
            options={ACH_Routing_Number_Type}
            value={cardInfo.routing_number_type}
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
          <Typography color={'info.main'} variant={'body2'}>
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
        <Typography variant={'h6'}>Confirm</Typography>
        <Stack direction={'row'} spacing={3}>
          <Stack spacing={1.5}>
            <Typography variant={'body3'}>
              By proceeding with this express payment, you confirm and ensure
              the following:
            </Typography>
            <Stack
              pl={1}
              sx={{ listStyle: 'decimal', listStylePosition: 'inside' }}
            >
              <Typography variant={'body3'}>
                The Bank Account information provided for this transaction is
                accurate and truthful.
              </Typography>
              <Typography variant={'body3'}>
                You have authorization as a signatory on the Bank Account.
              </Typography>
              <Typography variant={'body3'}>
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
              Make payment
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
