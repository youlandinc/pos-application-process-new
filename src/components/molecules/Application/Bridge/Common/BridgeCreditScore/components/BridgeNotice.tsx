import { FC } from 'react';
import { Typography } from '@mui/material';

import { StyledFormItem } from '@/components/atoms';
import { useSessionStorageState } from '@/hooks';

export const BridgeNotice: FC = () => {
  const { state } = useSessionStorageState('tenantConfig');
  return (
    <>
      <StyledFormItem label={"Let's check your credit."}>
        <Typography color={'info.main'} textAlign={'center'} variant={'body1'}>
          The next step is a soft credit pull. Don&apos;t worry, this is a
          normal part of the process and won&apos;t lower your credit score at
          all. It just helps us figure out your general price range.
        </Typography>
        {/*todo : saas */}
        <Typography
          color={'info.main'}
          mt={1.5}
          textAlign={'center'}
          variant={'body1'}
        >
          By clicking Next, you are authorizing
          {
            //sass
            ' ' + state?.organizationName || ' YouLand'
          }{' '}
          to do a soft pull on your credit.
        </Typography>
      </StyledFormItem>
    </>
  );
};
