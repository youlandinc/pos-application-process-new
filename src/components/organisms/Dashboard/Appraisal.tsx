import { FC, useEffect, useMemo, useState } from 'react';
import { Fade, Stack, Typography } from '@mui/material';

import { useBreakpoints } from '@/hooks';

import {
  StyledButton,
  StyledFormItem,
  StyledLoading,
} from '@/components/atoms';
import {
  AppraisalPayment,
  AppraisalProfile,
  AppraisalSummary,
} from '@/components/molecules';

export const Appraisal: FC = () => {
  const breakpoints = useBreakpoints();

  const [loading, setLoading] = useState(true);

  const [appraisalStatus, setAppraisalStatus] = useState<
    'profile' | 'payment' | 'afterPayment'
  >('profile');

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const renderFormNode = useMemo(() => {
    if (appraisalStatus === 'profile') {
      return (
        <StyledFormItem label={'Appraisal'}>
          <AppraisalProfile />
        </StyledFormItem>
      );
    }
    return (
      <StyledFormItem label={'Complete your appraisal payment below'}>
        <AppraisalSummary />
        <AppraisalPayment />
      </StyledFormItem>
    );
  }, [appraisalStatus]);

  const renderFormButton = useMemo(() => {
    if (appraisalStatus === 'profile') {
      return (
        <Stack alignItems={'center'} width={'100%'}>
          <StyledButton
            color={'primary'}
            onClick={() => {
              setAppraisalStatus('payment');
            }}
            sx={{ maxWidth: 276, width: '100%' }}
          >
            Next
          </StyledButton>
        </Stack>
      );
    }
    return (
      <Stack
        flexDirection={'row'}
        gap={3}
        justifyContent={'center'}
        width={'100%'}
      >
        <StyledButton
          color={'info'}
          onClick={() => {
            setAppraisalStatus('profile');
          }}
          sx={{ maxWidth: 276, width: '100%' }}
          variant={'text'}
        >
          Back
        </StyledButton>
        <StyledButton sx={{ maxWidth: 276, width: '100%' }}>
          Pay now
        </StyledButton>
      </Stack>
    );
  }, [appraisalStatus]);

  return loading ? (
    <Stack
      alignItems={'center'}
      justifyContent={'center'}
      margin={'auto 0'}
      minHeight={'calc(667px - 46px)'}
      width={'100%'}
    >
      <StyledLoading sx={{ color: 'text.grey' }} />
    </Stack>
  ) : (
    <Fade in={!loading}>
      <Stack
        gap={3}
        justifyContent={'flex-start'}
        maxWidth={900}
        mx={{ lg: 'auto', xs: 0 }}
        px={{ lg: 3, xs: 0 }}
        width={'100%'}
      >
        {renderFormNode}
        {renderFormButton}
      </Stack>
    </Fade>
  );
};
