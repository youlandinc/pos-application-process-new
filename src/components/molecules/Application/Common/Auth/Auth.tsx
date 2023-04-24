import { StyledButton } from '@/components';
import React, { FC, useEffect, useState } from 'react';
import { Box } from '@mui/material';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { usePersistFn } from '@/hooks';
import { Login, SignUp } from '@/components/molecules';
import { _bindProcess } from '@/requests';

export const Auth: FC<FormNodeBaseProps> = observer((props) => {
  const { prevStep, nextStep } = props;
  const { session, bpmn } = useMst();
  const [authState, setAuthState] = useState<'login' | 'signUp'>('login');

  const bindProcess = usePersistFn(() => {
    _bindProcess(bpmn.processId)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  useEffect(() => {
    if (session) {
      nextStep();
    }
  }, [bpmn.owners, nextStep, session]);

  return (
    <>
      {authState === 'signUp' ? (
        <SignUp isNestForm={true} />
      ) : (
        <Login isNestForm={true} successCb={bindProcess} />
      )}
      <Box>
        <StyledButton disableRipple={true} onClick={prevStep}>
          Back
        </StyledButton>
      </Box>
    </>
  );
});
