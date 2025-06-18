import { FC, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';

import { observer } from 'mobx-react-lite';

import { useSessionStorageState } from '@/hooks';
import { POSFormatUrl } from '@/utils';

import { StyledButton, StyledFormItem, Transitions } from '@/components/atoms';
import { ForgotPassword, Login, SignUp } from '@/components/molecules';

export const Auth: FC<FormNodeBaseProps> = observer(
  ({ backStep, backState, nextStep }) => {
    const { saasState } = useSessionStorageState('tenantConfig');

    const [authType, setAuthType] = useState<
      'login' | 'sign_up' | 'reset_password'
    >('login');

    return (
      <StyledFormItem
        label={
          authType === 'login'
            ? 'Log in to save your progress'
            : authType === 'sign_up'
              ? 'Sign up to save your progress'
              : 'Reset password'
        }
        labelSx={{ textAlign: { xs: 'left', md: 'center' }, pb: 0 }}
        sx={{ maxWidth: 600, m: '0 auto' }}
      >
        <Transitions style={{ width: '100%' }}>
          {authType === 'sign_up' ? (
            <>
              <SignUp
                isNestForm={true}
                isRedirect={false}
                successCb={nextStep}
              />
              <Box className="POS_tc POS_mt_3">
                <Typography component={'div'} variant={'body2'}>
                  Already have an account?{' '}
                  <Typography
                    component={'span'}
                    onClick={() => setAuthType('login')}
                    sx={{
                      color: 'primary.main',
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                    variant={'body2'}
                  >
                    Log in
                  </Typography>
                </Typography>
                <Typography
                  component={'div'}
                  sx={{ color: 'info.main', mt: 3 }}
                  variant={'body2'}
                >
                  By signing up, you agree to our{' '}
                  <Typography
                    component={'span'}
                    onClick={() =>
                      window.open(
                        POSFormatUrl(saasState?.legalAgreements?.termsUrl) ||
                          'https://corepass.com/legal/terms-and-conditions/',
                      )
                    }
                    sx={{
                      color: 'primary.main',
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                    variant={'body2'}
                  >
                    Terms of Use{' '}
                  </Typography>
                  and{' '}
                  <Typography
                    component={'span'}
                    onClick={() =>
                      window.open(
                        POSFormatUrl(
                          saasState?.legalAgreements?.privacyPolicyUrl,
                        ) || 'https://corepass.com/legal/privacy-policy/',
                      )
                    }
                    sx={{
                      color: 'primary.main',
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                    variant={'body2'}
                  >
                    Privacy Policy
                  </Typography>
                  ,
                </Typography>
                <Typography color={'text.secondary'} variant={'body2'}>
                  and consent to receive loan-related emails and SMS from{' '}
                  {saasState?.dbaName}.
                </Typography>
              </Box>
            </>
          ) : authType === 'login' ? (
            <>
              <Login isNestForm={true} successCb={nextStep} />
              <Stack
                flexDirection={{ md: 'row', xs: 'column' }}
                justifyContent={{ md: 'space-between', xs: 'center' }}
                mt={3}
              >
                <Typography variant={'body2'}>
                  Don&apos;t have an account?{' '}
                  <Typography
                    component={'span'}
                    onClick={() => setAuthType('sign_up')}
                    sx={{
                      color: 'primary.main',
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                    variant={'body2'}
                  >
                    Sign up
                  </Typography>
                </Typography>
                <Typography
                  color={'primary'}
                  onClick={() => setAuthType('reset_password')}
                  sx={{
                    color: 'primary.main',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                  variant={'body2'}
                >
                  Forgot password?
                </Typography>
              </Stack>
            </>
          ) : (
            <>
              <ForgotPassword
                isNestForm
                isRedirect={false}
                successCb={() => setAuthType('login')}
              />
              <Typography
                color={'info'}
                mt={3}
                onClick={() => setAuthType('login')}
                sx={{
                  color: 'primary.main',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
                textAlign={'right'}
                variant={'body2'}
              >
                Back to log in
              </Typography>
            </>
          )}
        </Transitions>

        <Stack mt={{ xs: 3, lg: 6 }} width={'100%'}>
          <StyledButton
            color={'info'}
            disabled={backState}
            onClick={backStep}
            variant={'text'}
          >
            Back
          </StyledButton>
        </Stack>
      </StyledFormItem>
    );
  },
);
