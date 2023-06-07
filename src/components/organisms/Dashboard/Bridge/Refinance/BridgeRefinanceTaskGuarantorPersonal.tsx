import { FC, useCallback, useMemo, useState } from 'react';
import { Stack } from '@mui/material';
import { useRouter } from 'next/router';
import { useAsync } from 'react-use';
import { useSnackbar } from 'notistack';

import { observer } from 'mobx-react-lite';

import { _fetchTaskFormInfo, _updateTaskFormInfo } from '@/requests/dashboard';
import {
  AUTO_HIDE_DURATION,
  OPTIONS_COMMON_STATE,
  OPTIONS_TASK_BORROWER_TYPE,
  OPTIONS_TASK_ENTITY_TYPE,
} from '@/constants';
import {
  DashboardTaskBorrowerEntityType,
  DashboardTaskBorrowerType,
} from '@/types';

import {
  StyledButton,
  StyledFormItem,
  StyledLoading,
  StyledSelect,
  StyledSelectOption,
  StyledTextField,
  Transitions,
} from '@/components/atoms';

export const BridgeRefinanceTaskGuarantorPersonal: FC = observer(() => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [saveLoading, setSaveLoading] = useState<boolean>(false);

  const [borrowerType, setBorrowerType] = useState<
    DashboardTaskBorrowerType | undefined
  >();
  const [entityName, setEntityName] = useState<string>('');
  const [signatoryTitle, setSignatoryTitle] = useState<string>('');
  const [entityType, setEntityType] = useState<
    DashboardTaskBorrowerEntityType | undefined
  >();
  const [stateId, setStateId] = useState<string>('');
  const [entityState, setEntityState] = useState<string | undefined>();

  const { loading } = useAsync(async () => {
    return await _fetchTaskFormInfo(router.query.taskId as string)
      .then((res) => {
        const {
          borrowerType,
          entityName,
          entityState,
          entityType,
          signatoryTitle,
          stateId,
        } = res.data;
        setBorrowerType(borrowerType);
        setEntityType(entityType);
        setEntityName(entityName);
        setSignatoryTitle(signatoryTitle);
        setEntityState(entityState);
        setStateId(stateId);
      })
      .catch((err) =>
        enqueueSnackbar(err as string, {
          variant: 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
        }),
      );
  }, [router.query.taskId]);

  const isDisabled = useMemo(() => {
    return borrowerType === DashboardTaskBorrowerType.individual
      ? false
      : !entityName &&
          !entityState &&
          !entityType &&
          !signatoryTitle &&
          !stateId;
  }, [
    borrowerType,
    entityName,
    entityState,
    entityType,
    signatoryTitle,
    stateId,
  ]);

  const handledSubmit = useCallback(async () => {
    setSaveLoading(true);
    const postData = {
      taskId: router.query.taskId as string,
      taskForm: {
        borrowerType,
        entityName,
        entityState,
        entityType,
        signatoryTitle,
        stateId,
      },
    };
    try {
      await _updateTaskFormInfo(postData);
      await router.push({
        pathname: '/dashboard/tasks',
        query: { processId: router.query.processId },
      });
    } catch (e) {
      enqueueSnackbar(e as string, {
        variant: 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
      });
    } finally {
      setSaveLoading(false);
    }
  }, [
    borrowerType,
    enqueueSnackbar,
    entityName,
    entityState,
    entityType,
    router,
    signatoryTitle,
    stateId,
  ]);

  return loading ? (
    <StyledLoading sx={{ color: 'primary.main' }} />
  ) : (
    <StyledFormItem
      gap={6}
      label={'Guarantor Details'}
      tip={
        'If you represent an entity, please update the borrower type below, and we will convert the previously filled borrower information into a guarantor for this entity.'
      }
      tipSx={{ mb: 0 }}
    >
      <StyledFormItem label={'Borrower Type'} sub>
        <Stack maxWidth={600} width={'100%'}>
          <StyledSelectOption
            onChange={(value) =>
              setBorrowerType(value as string as DashboardTaskBorrowerType)
            }
            options={OPTIONS_TASK_BORROWER_TYPE}
            value={borrowerType}
          />
        </Stack>
      </StyledFormItem>

      <Transitions
        style={{
          display:
            borrowerType === DashboardTaskBorrowerType.entity ? 'flex' : 'none',
          width: '100%',
        }}
      >
        {borrowerType === DashboardTaskBorrowerType.entity && (
          <StyledFormItem label={'Entity Information'} sub>
            <Stack gap={3} maxWidth={600} width={'100%'}>
              <StyledTextField
                label={'Entity Name'}
                onChange={(e) => setEntityName(e.target.value)}
                value={entityName}
              />
              <StyledTextField
                label={'Authorized Signatory Title'}
                onChange={(e) => setSignatoryTitle(e.target.value)}
                value={signatoryTitle}
              />
              <StyledSelect
                label={'Entity Type'}
                onChange={(e) =>
                  setEntityType(
                    e.target.value as string as DashboardTaskBorrowerEntityType,
                  )
                }
                options={OPTIONS_TASK_ENTITY_TYPE}
                value={entityType}
              />
              <StyledTextField
                label={'Secretary of State ID'}
                onChange={(e) => setStateId(e.target.value)}
                value={stateId}
              />
              <StyledSelect
                label={'Formation State'}
                onChange={(e) => setEntityState(e.target.value as string)}
                options={OPTIONS_COMMON_STATE}
                value={entityState}
              />
            </Stack>
          </StyledFormItem>
        )}
      </Transitions>

      <Stack
        flexDirection={'row'}
        gap={3}
        justifyContent={'space-between'}
        maxWidth={600}
        width={'100%'}
      >
        <StyledButton
          color={'info'}
          onClick={() =>
            router.push({
              pathname: '/dashboard/tasks',
              query: { processId: router.query.processId },
            })
          }
          sx={{ flex: 1 }}
          variant={'text'}
        >
          Back
        </StyledButton>
        <StyledButton
          disabled={isDisabled || saveLoading}
          loading={saveLoading}
          loadingText={'Saving...'}
          onClick={handledSubmit}
          sx={{ flex: 1 }}
        >
          Save
        </StyledButton>
      </Stack>
    </StyledFormItem>
  );
});
