import { FC, useCallback, useMemo, useState } from 'react';
import { Stack } from '@mui/material';
import { useRouter } from 'next/router';
import { useAsync } from 'react-use';
import { useSnackbar } from 'notistack';

import { observer } from 'mobx-react-lite';

import { _fetchTaskFormInfo, _updateTaskFormInfo } from '@/requests/dashboard';
import {
  DashboardTaskBorrowerEntityType,
  DashboardTaskBorrowerType,
} from '@/types';
import {
  AUTO_HIDE_DURATION,
  OPTIONS_COMMON_STATE,
  OPTIONS_TASK_BORROWER_TYPE,
  OPTIONS_TASK_ENTITY_TYPE,
} from '@/constants';

import {
  StyledButton,
  StyledFormItem,
  StyledLoading,
  StyledSelect,
  StyledSelectOption,
  StyledTextField,
  Transitions,
} from '@/components/atoms';

export const BridgePurchaseTaskBorrowerType: FC = observer(() => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [saveLoading, setSaveLoading] = useState<boolean>(false);

  const [borrowerType, setBorrowerType] = useState<
    DashboardTaskBorrowerType | undefined
  >();
  const [entityName, setEntityName] = useState<string | undefined>('');
  const [signatoryTitle, setSignatoryTitle] = useState<string | undefined>('');
  const [entityType, setEntityType] = useState<
    DashboardTaskBorrowerEntityType | undefined
  >();
  const [stateId, setStateId] = useState<string | undefined>('');
  const [entityState, setEntityState] = useState<string | undefined>();

  const [trustName, setTrustName] = useState<string | undefined>('');

  const [authorizedSignatoryName, setAuthorizedSignatoryName] =
    useState<string>('');

  const { loading } = useAsync(async () => {
    if (!router.query.taskId) {
      await router.push({
        pathname: '/dashboard/tasks',
        query: { processId: router.query.processId },
      });
      return;
    }
    return await _fetchTaskFormInfo(router.query.taskId as string)
      .then((res) => {
        const {
          borrowerType,
          entityName,
          entityState,
          entityType,
          signatoryTitle,
          stateId,
          authorizedSignatoryName,
          trustName,
        } = res.data;

        setBorrowerType(borrowerType || undefined);
        setEntityType(entityType || undefined);
        setEntityName(entityName || undefined);
        setSignatoryTitle(signatoryTitle || undefined);
        setEntityState(entityState || undefined);
        setStateId(stateId || undefined);

        setAuthorizedSignatoryName(authorizedSignatoryName || undefined);
        setTrustName(trustName || undefined);
      })
      .catch((err) =>
        enqueueSnackbar(err as string, {
          variant: 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
          onClose: () =>
            router.push({
              pathname: '/dashboard/tasks',
              query: { processId: router.query.processId },
            }),
        }),
      );
  }, [router.query.taskId]);

  const isDisabled = useMemo(() => {
    switch (borrowerType) {
      case DashboardTaskBorrowerType.individual:
        return false;
      case DashboardTaskBorrowerType.trust:
        return !trustName && !signatoryTitle;
      case DashboardTaskBorrowerType.entity:
        return (
          !entityName &&
          !entityState &&
          !entityType &&
          !signatoryTitle &&
          !stateId
        );
    }
  }, [
    borrowerType,
    entityName,
    entityState,
    entityType,
    signatoryTitle,
    stateId,
    trustName,
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
        trustName,
        authorizedSignatoryName,
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
    authorizedSignatoryName,
    borrowerType,
    enqueueSnackbar,
    entityName,
    entityState,
    entityType,
    router,
    signatoryTitle,
    stateId,
    trustName,
  ]);

  return loading ? (
    <StyledLoading sx={{ color: 'text.grey' }} />
  ) : (
    <StyledFormItem
      gap={6}
      label={'Borrower Type'}
      tip={
        'If you represent an entity/trust, please update the borrower type below, and we will convert the previously filled borrower information into a guarantor for this entity/trust.'
      }
      tipSx={{ mb: 0 }}
    >
      <Stack maxWidth={600} width={'100%'}>
        <StyledSelectOption
          onChange={(value) =>
            setBorrowerType(value as string as DashboardTaskBorrowerType)
          }
          options={OPTIONS_TASK_BORROWER_TYPE}
          value={borrowerType}
        />
      </Stack>

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
                disabled
                label={'Authorized Signatory Name'}
                value={authorizedSignatoryName}
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

      <Transitions
        style={{
          display:
            borrowerType === DashboardTaskBorrowerType.trust ? 'flex' : 'none',
          width: '100%',
        }}
      >
        {borrowerType === DashboardTaskBorrowerType.trust && (
          <StyledFormItem label={'Trust Information'} sub>
            <Stack gap={3} maxWidth={600} width={'100%'}>
              <StyledTextField
                label={'Trust Name'}
                onChange={(e) => setTrustName(e.target.value)}
                value={trustName}
              />
              <StyledTextField
                disabled
                label={'Authorized Signatory Name'}
                value={authorizedSignatoryName}
              />
              <StyledTextField
                label={'Authorized Signatory Title'}
                onChange={(e) => setSignatoryTitle(e.target.value)}
                value={signatoryTitle}
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
