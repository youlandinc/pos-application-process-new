import { FC, useEffect, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { usePersistFn, useSessionStorageState } from '@/hooks';
import { ForgotPassword, Login, SignUp } from '@/components/molecules';
import { _bindProcess } from '@/requests';

import { StyledButton, StyledFormItem, Transitions } from '@/components/atoms';

export const Auth: FC<FormNodeBaseProps> = observer((props) => {
  const { prevStep, nextStep } = props;
  const { saasState } = useSessionStorageState('tenantConfig');
  const { session, bpmn } = useMst();
  const [authType, setAuthType] = useState<
    'login' | 'sign_up' | 'reset_password'
  >('login');

  const bindProcess = usePersistFn(() => {
    _bindProcess(bpmn.processId as string)
      .then((res) => {
        //eslint-disable-next-line no-console
        console.log(res);
      })
      .catch((err) => {
        //eslint-disable-next-line no-console
        console.log(err);
      });
  });

  useEffect(() => {
    if (session) {
      nextStep();
    }
  }, [bpmn.owners, nextStep, session]);

  return (
    <Stack
      alignItems={'center'}
      flexDirection={'column'}
      gap={6}
      justifyContent={'center'}
      width={'100%'}
    >
      <StyledFormItem
        label={
          authType === 'login'
            ? `Welcome to ${' ' + saasState?.organizationName || 'YouLand'} !`
            : authType === 'sign_up'
            ? 'Sign up'
            : 'Rest password'
        }
        sx={{ maxWidth: 600 }}
      >
        <Transitions style={{ width: '100%' }}>
          {authType === 'sign_up' ? (
            <>
              <SignUp isNestForm={true} isRedirect={false} />
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
                      window.open('https://www.youland.com/legal/terms/')
                    }
                    sx={{
                      color: 'primary.main',
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                    variant={'body2'}
                  >
                    Term of Use{' '}
                  </Typography>
                  and to receive YouLand emails & updates and acknowledge that
                  you read our{' '}
                  <Typography
                    component={'span'}
                    onClick={() =>
                      window.open('https://www.youland.com/legal/privacy/')
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
                  .
                </Typography>
              </Box>
            </>
          ) : authType === 'login' ? (
            <>
              <Login isNestForm={true} successCb={bindProcess} />
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
      </StyledFormItem>
      <StyledButton
        color={'info'}
        onClick={prevStep}
        sx={{ width: '100%', maxWidth: 600 }}
        variant={'text'}
      >
        Back
      </StyledButton>
    </Stack>
  );
});
