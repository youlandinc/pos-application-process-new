import { OPTIONS_BRIDGE_CHANNEL } from '@/constants';
import { FC } from 'react';
import { Stack } from '@mui/material';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { StyledButton, StyledFormItem, StyledSelect } from '@/components';

export const WhereKnow: FC<FormNodeBaseProps> = observer(
  ({
    nextStep,
    prevStep,
    changeTaskState: prevTaskState,
    completeTaskState: nextTaskState,
    updateState: storeDataState,
  }) => {
    const {
      applicationForm: {
        formData: { whereKnowUs },
      },
    } = useMst();
    return (
      <>
        <StyledFormItem
          alignItems={'center'}
          label={'Where you heard about us ?'}
        >
          <StyledSelect
            label={'Please select one'}
            onChange={(e) =>
              whereKnowUs.changeFieldValue('reference', e.target.value)
            }
            options={OPTIONS_BRIDGE_CHANNEL}
            value={whereKnowUs.reference}
            sx={{ maxWidth: 600 }}
          />
        </StyledFormItem>
        <Stack
          alignItems={'center'}
          flex={1}
          flexDirection={'row'}
          gap={3}
          justifyContent={'center'}
          maxWidth={600}
          mt={3}
          width={'100%'}
        >
          <StyledButton
            color={'info'}
            disabled={
              prevTaskState.loading ||
              storeDataState.loading ||
              nextTaskState.loading
            }
            onClick={prevStep}
            sx={{ flex: 1 }}
            variant={'text'}
          >
            Back
          </StyledButton>
          <StyledButton
            disabled={
              prevTaskState.loading ||
              storeDataState.loading ||
              nextTaskState.loading ||
              !whereKnowUs.checkIsValid
            }
            loading={storeDataState.loading || nextTaskState.loading}
            onClick={nextStep}
            sx={{ flex: 1 }}
          >
            Next
          </StyledButton>
        </Stack>
      </>
    );
  },
);
