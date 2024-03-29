import { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Stack } from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useAsyncFn } from 'react-use';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import {
  StyledButton,
  StyledFormItem,
  StyledLoading,
} from '@/components/atoms';
import { useNotification } from '@/hooks/useNotification';

import { _fetchProcessData, _startProcess } from '@/requests';
import { usePersistFn, useSessionStorageState, useStoreData } from '@/hooks';
import { POSFindSpecificVariable } from '@/utils';

import { AUTO_HIDE_DURATION } from '@/constants';
import { POSFlex, POSFont } from '@/styles';

import {
  BridgeApplicationProcessSnapshot,
  HttpError,
  MortgageApplicationProcessSnapshot,
  ProcessData,
  VariableName,
} from '@/types';

//import { MortgagePurchaseForm, MortgageRefinanceForm } from './Mortgage';
import { BridgePurchaseForm, BridgeRefinanceForm } from './Bridge';
import { FixPurchaseForm, FixRefinanceForm } from './Fix';
import { GroundPurchaseForm, GroundRefinanceForm } from './Ground';

export interface LoanApplicationProps {
  productCategory: ProductCategory;
  applicationType: ApplicationType;
}

const useInitProcessData = (
  productCategory: ProductCategory,
  productType: ApplicationType,
) => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const store = useMst();
  const { bpmn, applicationForm, session } = store;
  const { initialized } = applicationForm;

  const hasProcessId = useMemo<boolean>(
    () => !!router.query.processId,
    [router.query],
  );
  const { bindProcess } = useStoreData();

  const [applicationType, setApplicationType] =
    useState<ApplicationType>(productType);

  const handleBack = useCallback(() => {
    applicationForm.setInitialized(false);
  }, [applicationForm]);

  const [lastSelectedType, setLastSelectedType] = useState<ApplicationType>();

  // todo : saas
  const { saasState } = useSessionStorageState('tenantConfig');

  // start new progress
  const [initState, startProgress] = useAsyncFn(
    async (applicationType, productCategory) => {
      let productName = `${productCategory}_${applicationType}`;
      if (productCategory === 'mortgage' && applicationType === 'purchase') {
        productName = 'mortgage';
      }
      // todo : tenantId should replace params
      return await _startProcess(
        productName,
        saasState?.tenantId || '1000052022092800000102',
      ).catch((err) => {
        const { header, message, variant } = err as HttpError;
        enqueueSnackbar(message, {
          variant: variant || 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
          isSimple: !header,
          header,
        });
        return;
      });
    },
    [bpmn],
  );

  const [loadState, fetchProcessData] = useAsyncFn(
    async (processId: string) => {
      return await _fetchProcessData(processId).catch((err) => {
        const { header, message, variant } = err as HttpError;
        enqueueSnackbar(message, {
          variant: variant || 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
          isSimple: !header,
          header,
        });
        return;
      });
    },
    [],
  );

  const loadServerTaskProgress = useCallback(
    (processData: ProcessData) => {
      bpmn.setProcessId(
        processData.extra.id || (router.query.processId as string),
      );
      bpmn.setTaskKey(processData.currentTasks[0].bpmn.key);
      bpmn.setTaskId(processData.currentTasks[0].extra.id);
      bpmn.setOwners(processData.owners);
      applicationForm.formData.loadProcessData(processData);
    },
    [applicationForm.formData, bpmn, router.query.processId],
  );

  const loadClientTaskProgressAndData = useCallback(
    (processData: ProcessData) => {
      const variables = processData.extra.variables;
      const clientAppProgressVariable = POSFindSpecificVariable<
        BridgeApplicationProcessSnapshot | MortgageApplicationProcessSnapshot
      >(VariableName.clientAppProgress, variables);
      if (clientAppProgressVariable) {
        const { applicationType, productCategory } =
          clientAppProgressVariable.value;
        applicationForm.initForm(productCategory, applicationType);
        applicationForm.formData.setClientState(
          clientAppProgressVariable.value,
        );
        setLastSelectedType(applicationType);
        setApplicationType(applicationType);
      } else {
        enqueueSnackbar(
          "Can't find the client process data, unable to initialize the application",
          {
            variant: 'error',
            autoHideDuration: AUTO_HIDE_DURATION,
          },
        );
      }
    },
    [applicationForm, enqueueSnackbar],
  );

  // if it has session & processId (This progress must belong to the current login user)
  const handleLoadProcess = usePersistFn(async (processId: string) => {
    const processData = await fetchProcessData(processId).catch((err) => {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
      });
      return;
    });
    if (!processData) {
      return;
    }
    // load the client application progress
    loadClientTaskProgressAndData(processData.data);
    // load the server application progress
    loadServerTaskProgress(processData.data);
    // If the process does not have owners, automatically bind
    if (processData.data.owners.length === 0 && initialized && session) {
      bindProcess();
    }
  });

  // If you don't bring a processId
  const handleInitForm = usePersistFn(() => {
    startProgress(applicationType, productCategory).then((res) => {
      if (!res) {
        return;
      }
      if (applicationType !== lastSelectedType) {
        applicationForm.initForm(productCategory, applicationType);
        setLastSelectedType(applicationType);
        if (res) {
          loadServerTaskProgress(res.data);
        }
      } else {
        applicationForm.setInitialized(true);
      }
      // update url params
      router.push(
        router.pathname,
        `${router.pathname}?processId=${bpmn.processId}`,
        { shallow: true },
      );
    });
  });

  // if url has processId, load processData
  useEffect(() => {
    if (hasProcessId) {
      handleLoadProcess(router.query.processId as string);
    }
  }, [handleLoadProcess, hasProcessId, router.query]);

  return {
    applicationType,
    handleBack,
    handleInitForm,
    setApplicationType,
    loadState,
    initState,
  };
};

const LoanApplicationButtonStyles = {
  ...POSFlex('center', 'center', 'row'),
  ...POSFont(20, 600, 1.5, 'info.dark'),
  cursor: 'pointer',
  height: 64,
  width: '100%',
  maxWidth: 600,
  border: '2px solid',
  borderColor: 'text.secondary',
  borderRadius: 2,
  transition: 'all .3s',
  '&:hover': {
    borderColor: 'primary.main',
  },
  '&.active': {
    bgcolor: 'primary.lighter',
    color: 'primary.darker',
    borderColor: 'primary.main',
  },
};

export const LoanApplication = observer<LoanApplicationProps>((props) => {
  const { productCategory, applicationType: productType } = props;
  const store = useMst();
  const router = useRouter();
  const {
    notificationStation,
    applicationForm: { initialized },
  } = store;

  const {
    applicationType,
    handleBack,
    handleInitForm,
    setApplicationType,
    loadState,
    initState,
  } = useInitProcessData(productCategory, productType);

  useNotification(notificationStation);

  const renderApplicationForm = useMemo(() => {
    // todo , fix this bug
    switch (productCategory) {
      case 'mortgage': {
        if (!productType && !applicationType) {
          return null;
        }
        if (productType === 'purchase' || applicationType === 'purchase') {
          //return <MortgagePurchaseForm handleBack={handleBack} />;
        }
        if (productType === 'refinance' || applicationType === 'refinance') {
          //return <MortgageRefinanceForm handleBack={handleBack} />;
        }
        break;
      }
      case 'bridge': {
        if (!productType && !applicationType) {
          return null;
        }
        if (productType === 'purchase' || applicationType === 'purchase') {
          return <BridgePurchaseForm handleBack={handleBack} />;
        }
        if (productType === 'refinance' || applicationType === 'refinance') {
          return <BridgeRefinanceForm handleBack={handleBack} />;
        }
        break;
      }
      case 'fix_and_flip': {
        if (!productType && !applicationType) {
          return null;
        }
        if (productType === 'purchase' || applicationType === 'purchase') {
          return <FixPurchaseForm handleBack={handleBack} />;
        }
        if (productType === 'refinance' || applicationType === 'refinance') {
          return <FixRefinanceForm handleBack={handleBack} />;
        }
        break;
      }
      case 'ground_up_construction': {
        if (!productType && !applicationType) {
          return null;
        }
        if (productType === 'purchase' || applicationType === 'purchase') {
          return <GroundPurchaseForm handleBack={handleBack} />;
        }
        if (productType === 'refinance' || applicationType === 'refinance') {
          return <GroundRefinanceForm handleBack={handleBack} />;
        }
        break;
      }
    }
  }, [productType, handleBack, productCategory, applicationType]);

  const renderLabel = useMemo(() => {
    switch (productCategory) {
      case 'bridge': {
        return 'Stabilized Bridge';
      }
      case 'fix_and_flip': {
        return 'Fix and Flip';
      }
      case 'ground_up_construction': {
        return 'Ground-up Construction';
      }
    }
  }, [productCategory]);

  return (
    <>
      {loadState.loading ? (
        <StyledLoading />
      ) : initialized ? (
        renderApplicationForm
      ) : (
        <Box width={'100%'}>
          <Stack alignItems={'center'} justifyContent={'center'} width={'100%'}>
            <StyledFormItem label={renderLabel} width={'100%'}>
              <Stack
                alignItems={'center'}
                gap={3}
                justifyContent={'center'}
                width={'100%'}
              >
                <Box
                  className={applicationType === 'purchase' ? 'active' : ''}
                  onClick={() => setApplicationType('purchase')}
                  sx={LoanApplicationButtonStyles}
                >
                  Purchase
                </Box>
                <Box
                  className={applicationType === 'refinance' ? 'active' : ''}
                  onClick={() => setApplicationType('refinance')}
                  sx={LoanApplicationButtonStyles}
                >
                  Refinance
                </Box>
                <Stack
                  alignItems={'center'}
                  flexDirection={'row'}
                  gap={3}
                  maxWidth={600}
                  mt={3}
                  width={'100%'}
                >
                  <StyledButton
                    color={'info'}
                    onClick={() => router.push('/')}
                    sx={{ width: 'calc(50% - 12px)' }}
                    variant={'text'}
                  >
                    Back
                  </StyledButton>
                  <StyledButton
                    disabled={!applicationType || initState.loading}
                    loading={initState.loading}
                    onClick={handleInitForm}
                    sx={{ width: 'calc(50% - 12px)' }}
                  >
                    Next
                  </StyledButton>
                </Stack>
              </Stack>
            </StyledFormItem>
          </Stack>
        </Box>
      )}
    </>
  );
});
