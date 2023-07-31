import { HASH_COMMON_PERSON } from '@/constants';
import { UserType } from '@/types';
import { FC } from 'react';
import { Typography } from '@mui/material';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { StyledFormItem } from '@/components/atoms';
import { useSessionStorageState } from '@/hooks';

export const BridgeNotice: FC = observer(() => {
  const { saasState } = useSessionStorageState('tenantConfig');
  const { userType } = useMst();

  return (
    <>
      <StyledFormItem
        label={`Let's check ${
          HASH_COMMON_PERSON[userType ?? UserType.CUSTOMER].pronoun
        } credit.`}
      >
        <Typography color={'info.main'} textAlign={'center'} variant={'body1'}>
          The next step is a soft credit pull. Don&apos;t worry, this is a
          normal part of the process and won&apos;t lower{' '}
          {HASH_COMMON_PERSON[userType ?? UserType.CUSTOMER].pronoun} credit
          score at all. It just helps us figure out{' '}
          {HASH_COMMON_PERSON[userType ?? UserType.CUSTOMER].pronoun} general
          price range.
        </Typography>
        <Typography
          color={'info.main'}
          mt={1.5}
          textAlign={'center'}
          variant={'body1'}
        >
          By clicking Next, you are authorizing
          {
            //sass
            ' ' + saasState?.organizationName || ' YouLand'
          }{' '}
          to do a soft pull on{' '}
          {HASH_COMMON_PERSON[userType ?? UserType.CUSTOMER].pronoun} credit.
        </Typography>
      </StyledFormItem>
    </>
  );
});
