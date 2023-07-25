import { FC, useCallback, useMemo } from 'react';
import { Stack } from '@mui/material';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { StartingState } from '@/types/enum';
import { IFixStarting } from '@/models/application/fix';

import { StyledButton } from '@/components/atoms';

import { FixProperty, FixPurpose } from './components';

const useStateMachine = (
  starting: IFixStarting,
  nextStep: FormNodeBaseProps['nextStep'],
  prevStep: FormNodeBaseProps['prevStep'],
) => {
  const transitions = useMemo<{
    [state: string]: {
      next: () => void;
      back: () => void;
    };
  }>(
    () => ({
      purpose: {
        back: () => {
          prevStep();
        },
        next: () => {
          starting.purpose.values.address.validateForm();
          if (starting.purpose.values.address.isValid) {
            starting.changeState(StartingState.property);
          }
        },
      },
      property: {
        back: () => {
          starting.changeState(StartingState.purpose);
        },
        next: () => {
          nextStep();
        },
      },
    }),
    [prevStep, starting, nextStep],
  );
  const next = useCallback(() => {
    transitions[starting.state].next();
  }, [starting.state, transitions]);

  const back = useCallback(() => {
    transitions[starting.state].back();
  }, [starting.state, transitions]);

  return {
    next,
    back,
  };
};

export const FixStarting: FC<FormNodeBaseProps> = observer((props) => {
  const { nextStep, prevStep, updateState, completeTaskState } = props;
  const {
    applicationForm: { formData },
  } = useMst();

  const starting = formData.starting as IFixStarting;

  const { back, next } = useStateMachine(starting, nextStep, prevStep);

  const renderFormNodeStep = useMemo(() => {
    switch (starting.state) {
      case StartingState.purpose:
        return <FixPurpose purpose={starting.purpose} />;
      case StartingState.property:
        return <FixProperty property={starting.property} />;
    }
  }, [starting.property, starting.purpose, starting.state]);

  return (
    <>
      {renderFormNodeStep}
      <Stack
        alignItems={'center'}
        flex={1}
        flexDirection={'row'}
        gap={3}
        justifyContent={'center'}
        maxWidth={600}
        width={'100%'}
      >
        <StyledButton
          color={'info'}
          onClick={back}
          sx={{ flex: 1 }}
          variant={'text'}
        >
          Back
        </StyledButton>
        <StyledButton
          disabled={
            !starting[starting.state].checkIsValid ||
            updateState.loading ||
            completeTaskState.loading
          }
          loading={updateState.loading || completeTaskState.loading}
          onClick={next}
          sx={{ flex: 1 }}
        >
          Next
        </StyledButton>
      </Stack>
    </>
  );
});
