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
  HttpError,
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

export const GroundPurchaseTaskBorrowerType: FC = observer(() => {
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
      .catch((err) => {
        const { header, message, variant } = err as HttpError;
        enqueueSnackbar(message, {
          variant: variant || 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
          isSimple: !header,
          header,
          onClose: () =>
            router.push({
              pathname: '/dashboard/tasks',
              query: { processId: router.query.processId },
            }),
        });
      });
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
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
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

  return (
    <>
      <Transitions
        style={{
          display: 'flex',
          width: '100%',
          justifyContent: 'center',
        }}
      >
        {loading ? (
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
          <StyledFormItem
            gap={6}
            label={'Borrower type'}
            maxWidth={900}
            mx={{ lg: 'auto', xs: 0 }}
            px={{ lg: 3, xs: 0 }}
            tip={
              'If you represent an entity/trust, please update the borrower type below, and we will convert the previously filled borrower information into a guarantor for this entity/trust.'
            }
            tipSx={{ mb: 0 }}
            width={'100%'}
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
                  borrowerType === DashboardTaskBorrowerType.entity
                    ? 'flex'
                    : 'none',
                width: '100%',
              }}
            >
              {borrowerType === DashboardTaskBorrowerType.entity && (
                <StyledFormItem label={'Entity information'} sub>
                  <Stack gap={3} maxWidth={600} width={'100%'}>
                    <StyledTextField
                      label={'Entity name'}
                      onChange={(e) => setEntityName(e.target.value)}
                      value={entityName}
                    />
                    <StyledTextField
                      disabled
                      label={'Authorized signatory name'}
                      value={authorizedSignatoryName}
                    />
                    <StyledTextField
                      label={'Authorized signatory title'}
                      onChange={(e) => setSignatoryTitle(e.target.value)}
                      value={signatoryTitle}
                    />
                    <StyledSelect
                      label={'Entity type'}
                      onChange={(e) =>
                        setEntityType(
                          e.target
                            .value as string as DashboardTaskBorrowerEntityType,
                        )
                      }
                      options={OPTIONS_TASK_ENTITY_TYPE}
                      value={entityType}
                    />
                    <StyledTextField
                      label={'Secretary of state ID'}
                      onChange={(e) => setStateId(e.target.value)}
                      value={stateId}
                    />
                    <StyledSelect
                      label={'Formation state'}
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
                  borrowerType === DashboardTaskBorrowerType.trust
                    ? 'flex'
                    : 'none',
                width: '100%',
              }}
            >
              {borrowerType === DashboardTaskBorrowerType.trust && (
                <StyledFormItem label={'Trust information'} sub>
                  <Stack gap={3} maxWidth={600} width={'100%'}>
                    <StyledTextField
                      label={'Trust name'}
                      onChange={(e) => setTrustName(e.target.value)}
                      value={trustName}
                    />
                    <StyledTextField
                      disabled
                      label={'Authorized signatory name'}
                      value={authorizedSignatoryName}
                    />
                    <StyledTextField
                      label={'Authorized signatory title'}
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
                Confirm
              </StyledButton>
            </Stack>
          </StyledFormItem>
        )}
      </Transitions>
    </>
  );
});
