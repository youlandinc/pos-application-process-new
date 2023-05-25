import { FC, useMemo } from 'react';
import { Stack, Typography } from '@mui/material';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { POSFormatDollar } from '@/utils';
import { StyledButton, StyledFormItem } from '@/components/atoms';
import { UserType } from '@/types/enum';
import { useSessionStorageState } from '@/hooks';

// saas
export const BridgeCelebrate: FC<{ nextStep: () => void }> = observer(
  ({ nextStep }) => {
    const {
      applicationForm: {
        formData: {
          starting: {
            purpose: {
              values: { address },
            },
          },
          estimateRate,
        },
        applicationType,
      },
      userType,
    } = useMst();
    const { state } = useSessionStorageState('tenantConfig');

    const loanAmount = useMemo(() => {
      let total = 0;
      if (applicationType === 'refinance') {
        const { isCor, balance, cor, isCashOut, cashOutAmount } = estimateRate;
        total += balance;
        if (isCor) {
          total += cor;
        }
        if (isCashOut) {
          total += cashOutAmount;
        }
      } else {
        const { isCor, purchaseLoanAmount, cor } = estimateRate;
        total += purchaseLoanAmount;
        if (isCor) {
          total += cor;
        }
      }
      return total;
    }, [applicationType, estimateRate]);

    return (
      <StyledFormItem
        label={`Congratulations${
          userType === UserType.CUSTOMER ? ", you're pre-qualified" : ''
        }!`}
      >
        <Stack
          alignItems={'center'}
          color={'info'}
          gap={3}
          textAlign={'center'}
        >
          <Typography color={'info.main'} variant={'body1'}>
            You are pre-qualified for a bridge loan up to{' '}
            <Typography component={'span'} fontWeight={600} variant={'inherit'}>
              {POSFormatDollar(loanAmount)}{' '}
            </Typography>
            for the residential property located at{' '}
            <Typography component={'span'} fontWeight={600} variant={'inherit'}>
              {`${address.formatAddress}`}
              {address.aptNumber && `, #${address.aptNumber}, `}
              {address.city && ` ${address.city},`}
              {address.state && ` ${address.state}`}
              {address.postcode && ` ${address.postcode}`}.{' '}
            </Typography>
            {userType === UserType.CUSTOMER && "That's huge!"}
          </Typography>

          <Typography color={'info.main'} variant={'body1'}>
            The next step is for you to complete your loan application. Before
            final approval of your loan,{' '}
            {
              //sass
              ' ' + state?.organizationName || ' YouLand'
            }{' '}
            must underwrite and verify all of your provided information.
          </Typography>

          <StyledButton
            onClick={nextStep}
            sx={{
              width: 180,
              height: 56,
              mt: 3,
              padding: '0 !important',
            }}
          >
            Go To Dashboard
          </StyledButton>
        </Stack>
      </StyledFormItem>
    );
  },
);
