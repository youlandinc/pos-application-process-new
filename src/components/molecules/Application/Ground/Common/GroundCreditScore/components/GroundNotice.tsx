import { FC } from 'react';
import { Typography } from '@mui/material';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { HASH_COMMON_PERSON } from '@/constants';
import { useSessionStorageState } from '@/hooks';
import { UserType } from '@/types';

import { StyledFormItem } from '@/components/atoms';

export const GroundNotice: FC = observer(() => {
  const { saasState } = useSessionStorageState('tenantConfig');
  const { userType } = useMst();

  return (
    <>
      <StyledFormItem
        label={`Let's check ${
          HASH_COMMON_PERSON[userType ?? UserType.CUSTOMER].the_pronoun
        } credit.`}
      >
        <Typography color={'info.main'} textAlign={'center'} variant={'body1'}>
          The next step is a soft credit pull. Don&apos;t worry, this is a
          normal part of the process and won&apos;t lower{' '}
          {HASH_COMMON_PERSON[userType ?? UserType.CUSTOMER].pronoun} credit
          score at all. It just helps us figure out{' '}
          {HASH_COMMON_PERSON[userType ?? UserType.CUSTOMER].the_pronoun}{' '}
          general price range.
        </Typography>
        <Typography
          color={'info.main'}
          mt={1.5}
          textAlign={'center'}
          variant={'body1'}
        >
          By clicking Next, you are authorizing
          {' ' + saasState?.organizationName || ' YouLand'} to run a soft pull
          on {HASH_COMMON_PERSON[userType ?? UserType.CUSTOMER].the_pronoun}{' '}
          credit.
        </Typography>
      </StyledFormItem>
    </>
  );
});
