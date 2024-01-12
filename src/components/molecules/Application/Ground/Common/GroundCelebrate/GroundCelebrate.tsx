import { FC, useMemo } from 'react';
import { Stack, Typography } from '@mui/material';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { HASH_COMMON_PERSON } from '@/constants';

import { POSFormatDollar, POSUpperFirstLetter } from '@/utils';
import { UserType } from '@/types/enum';
import { useSessionStorageState } from '@/hooks';

import { StyledButton, StyledFormItem } from '@/components/atoms';

// saas
export const GroundCelebrate: FC<{ nextStep: () => void }> = observer(
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
    const { saasState } = useSessionStorageState('tenantConfig');

    const loanAmount = useMemo(() => {
      let total = 0;
      if (applicationType === 'refinance') {
        const { balance, cor, isCashOut, cashOutAmount } = estimateRate;
        total += balance || 0;
        total += cor || 0;
        if (isCashOut) {
          total += cashOutAmount || 0;
        }
      } else {
        const { purchaseLoanAmount, cor } = estimateRate;
        total += purchaseLoanAmount || 0;
        total += cor || 0;
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
            {POSUpperFirstLetter(
              HASH_COMMON_PERSON[userType ?? UserType.CUSTOMER]
                .the_third_pronoun,
            )}{' '}
            {userType === UserType.CUSTOMER ? 'are' : 'is'} pre-qualified for a
            ground up construction loan up to{' '}
            <Typography component={'span'} fontWeight={600} variant={'inherit'}>
              {POSFormatDollar(loanAmount)}{' '}
            </Typography>
            for the property located at{' '}
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
            The next step is to complete the loan application. Before final
            approval of your loan,{' '}
            {
              //sass
              ' ' + saasState?.organizationName || ' YouLand'
            }{' '}
            must underwrite and verify all of{' '}
            {HASH_COMMON_PERSON[userType ?? UserType.CUSTOMER].the_pronoun}{' '}
            provided information.
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
            Go to dashboard
          </StyledButton>
        </Stack>
      </StyledFormItem>
    );
  },
);
