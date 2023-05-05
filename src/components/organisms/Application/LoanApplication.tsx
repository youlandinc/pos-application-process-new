import { POSFlex, POSFont } from '@/styles';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Stack } from '@mui/material';
//import { Box, CircularProgress, makeStyles } from '@material-ui/core';
//import { flexCenter, size, POSFont } from '@/common/styles/global';
//import { MortgagePurchaseForm, MortgageRefinanceForm } from './Mortgage';
//import { BridgePurchaseForm, BridgeRefinanceForm } from './Bridge';
//import { useNextBtnClasses } from '@/common/classes';

import { useRouter } from 'next/router';

import {
  StyledButton,
  StyledFormItem,
  StyledLoading,
} from '@/components/atoms';
import { useAsyncFn } from 'react-use';
import { useNotification } from '@/hooks/useNotification';

import { usePersistFn, useStoreData } from '@/hooks';
import { POSFindSpecificVariable } from '@/utils';
import { _fetchProcessData, _startProcess } from '@/requests';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';
import {
  SBridgePurchase,
  SBridgeRefinance,
  SMortgagePurchase,
  SMortgageRefinance,
} from '@/models/application/base';
import {
  BridgeApplicationProcessSnapshot,
  MortgageApplicationProcessSnapshot,
  ProcessData,
  VariableName,
} from '@/types';

export interface LoanApplicationProps {
  productCategory: ProductCategory;
  applicationType: ApplicationType;
}

const useInitProcessData = (
  productCategory: ProductCategory,
  productType: ApplicationType,
) => {
  const router = useRouter();

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

  //const getTenantConfig = utils.getTenantConfig();

  // start new progress
  const [initState, startProgress] = useAsyncFn(
    async (applicationType, productCategory) => {
      let productName = `${productCategory}_${applicationType}`;
      if (productCategory === 'mortgage' && applicationType === 'purchase') {
        productName = 'mortgage';
      }
      // todo : tenantId should replace params
      return await _startProcess(productName, '1000052022092800000102').catch(
        (err) => {
          console.log(err);
          return;
        },
      );
    },
    [bpmn],
  );

  const [loadState, fetchProcessData] = useAsyncFn(
    async (processId: string) => {
      return await _fetchProcessData(processId).catch((err) => {
        console.log(err);
        return;
      });
    },
    [],
  );

  const loadServerTaskProgress = useCallback(
    (processData: ProcessData) => {
      bpmn.setProcessId(processData.extra.id);
      bpmn.setTaskKey(processData.currentTasks[0].bpmn.key);
      bpmn.setTaskId(processData.currentTasks[0].extra.id);
      bpmn.setOwners(processData.owners);
      applicationForm.formData.loadProcessData(processData);
    },
    [applicationForm.formData, bpmn],
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
        console.error(
          "Can't find the client process data, unable to initialize the application",
        );
      }
    },
    [applicationForm],
  );

  // if has session & processId (This progress must belong to the current login user)
  const handleLoadProcess = usePersistFn(async (processId: string) => {
    const processData = await fetchProcessData(processId).catch((err) => {
      console.log(err);
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
        applicationForm.initForm<
          | SMortgagePurchase
          | SMortgageRefinance
          | SBridgePurchase
          | SBridgeRefinance
        >(productCategory, applicationType);
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
  ...POSFont(20, 600, 1.5, 'text.primary'),
  cursor: 'pointer',
  height: 64,
  width: '100%',
  maxWidth: 600,
  border: '2px solid #C5D1FF',
  borderRadius: 2,
  transition: 'all .3s',
  '&:hover': {
    borderColor: 'primary.main',
  },
  '&.active': {
    bgcolor: '#C5D1FF',
    color: 'primary.main',
    borderColor: 'primary.main',
  },
};

export const LoanApplication = observer<LoanApplicationProps>((props) => {
  const { productCategory, applicationType: productType } = props;
  const store = useMst();
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
          return <>purchase</>;
          //return <BridgePurchaseForm handleBack={handleBack} />;
        }
        if (productType === 'refinance' || applicationType === 'refinance') {
          return <>refinance</>;
          //return <BridgeRefinanceForm handleBack={handleBack} />;
        }
        break;
      }
    }
  }, [productType, handleBack, productCategory, applicationType]);

  const renderLabel = useMemo(() => {
    switch (productCategory) {
      case 'bridge': {
        return 'Bridge/Fix and Flip';
      }
    }
  }, [productCategory]);

  return (
    <>
      {initialized ? (
        renderApplicationForm
      ) : (
        <Box width={'100%'}>
          {loadState.loading ? (
            <StyledLoading />
          ) : (
            <Stack
              alignItems={'center'}
              justifyContent={'center'}
              width={'100%'}
            >
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
                    Are you buying?
                  </Box>
                  <Box
                    className={applicationType === 'refinance' ? 'active' : ''}
                    onClick={() => setApplicationType('refinance')}
                    sx={LoanApplicationButtonStyles}
                  >
                    Refinancing?
                  </Box>
                  <StyledButton
                    disabled={!applicationType}
                    loading={initState.loading}
                    onClick={handleInitForm}
                    sx={{ width: '100%', maxWidth: 600, mt: 3 }}
                  >
                    Next
                  </StyledButton>
                </Stack>
              </StyledFormItem>
            </Stack>
          )}
        </Box>
      )}
    </>
  );
});
