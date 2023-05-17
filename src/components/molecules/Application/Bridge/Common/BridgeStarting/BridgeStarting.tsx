import { FC, useCallback, useMemo } from 'react';
import { Stack } from '@mui/material';
import dynamic from 'next/dynamic';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { StartingState } from '@/types/enum';
import { IBridgeStarting } from '@/models/application/bridge';

import { StyledButton, StyledLoading } from '@/components/atoms';

import { BridgePurpose, BridgeProperty } from './components';

const DynamicPurpose = dynamic(
  () => import('./components/BridgePurpose').then((mod) => mod.BridgePurpose),
  {
    loading: () => <StyledLoading />,
  },
);
const DynamicProperty = dynamic(
  () => import('./components/BridgeProperty').then((mod) => mod.BridgeProperty),
  {
    loading: () => <StyledLoading />,
  },
);

const useStateMachine = (
  starting: IBridgeStarting,
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

export const BridgeStarting: FC<FormNodeBaseProps> = observer((props) => {
  const { nextStep, prevStep, updateState, completeTaskState } = props;
  const {
    applicationForm: { formData },
  } = useMst();

  const starting = formData.starting as IBridgeStarting;

  const { back, next } = useStateMachine(starting, nextStep, prevStep);

  const renderFormNodeStep = useMemo(() => {
    switch (starting.state) {
      case StartingState.purpose:
        return <BridgePurpose purpose={starting.purpose} />;
      case StartingState.property:
        return <BridgeProperty property={starting.property} />;
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
