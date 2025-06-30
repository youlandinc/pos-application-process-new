import { Dispatch, FC, SetStateAction } from 'react';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { StyledFormItem, StyledTextField } from '@/components/atoms';
import { TasksBorrowerSignatories } from './index';

interface TasksBorrowerTrustProps {
  formError: Record<string, any> | undefined;
  setFormError: Dispatch<SetStateAction<Record<string, any> | undefined>>;
}

export const TasksBorrowerTrust: FC<TasksBorrowerTrustProps> = observer(
  ({ formError, setFormError }) => {
    const {
      dashboardInfo: { taskBorrower },
    } = useMst();

    return (
      <>
        <StyledFormItem gap={3} label={'Trust information'} sub>
          <StyledTextField
            label={'Trust name'}
            onChange={(e) => {
              if (formError?.trustName) {
                setFormError((prev) => {
                  if (prev) {
                    delete prev.trustName;
                  }
                  return prev;
                });
              }
              taskBorrower.changeFieldValue('trustName', e.target.value);
            }}
            placeholder={'Trust name'}
            sx={{ maxWidth: 600 }}
            validate={formError?.trustName}
            value={taskBorrower.trustName}
          />
        </StyledFormItem>

        <TasksBorrowerSignatories />
      </>
    );
  },
);
